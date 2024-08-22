import { Component, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/ApiService';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/AuthService';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { forkJoin, Observable, of, pipe } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DialogComponent } from '../dialog/dialog.component';
import { ActiveElement, ChartConfiguration, ChartData, ChartEvent, ChartOptions } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver } from '@angular/cdk/layout';

interface DecodedToken {
  userId: number;
  sub: string;
  roles: string;
  companyId: number;
}

interface Lote {
  id: number;
  name: string;
  descriptions: string;
  dimensions: number;
  typeCrop: {
    id: number;
    name: string;
  };
  url_profile: string | null;
  plant_name?: string;
  type_crop_id?: number;
}

interface DataChacras{
  id: number;
  name: string;
  dimension: number;
  lotes: DataLotes[];
}

interface DataLotes {
  id: number;
  name: string;
  dimension: number;
  plantacion: Plantacion;
}

interface Plantacion {
  id: number;
  name: string;
}

interface PieChart {
  name: string;
  id: number;
  chacra: ChacraPieChart[]
}

interface ChacraPieChart {
  name: string;
  lote: LotePieChart
}

interface LotePieChart {
  name: string;
  size: number;
}

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.sass']
})
export class InformesComponent {

  private userId: number | any;
  loteData: Lote[] = [];
  campoData = {
    name: '',
    dimensions: '',
    geolocation: '',
    observation: '',
    address: {
      address: '',
      location: '',
    },
     
  };
  campoTabla: any[] =[];
  chacras: DataChacras[] = [];
  displayedColumns: string[] = [];
  dataSourceBar: MatTableDataSource<DataLotes> = new MatTableDataSource<DataLotes>([]);
  dataSourcePie: MatTableDataSource<ChacraPieChart> = new MatTableDataSource<ChacraPieChart>([]);
  objetoPlantaciones : PieChart[] = [];
  hectareasTotal: number= 0;
  buttonsDisabled: boolean = true;
  selectedButtonId: number | null = null;
  showBarChart: number = 0;
  datasetIndex: any = 0
  datasetIndexPie: any = 0
  isScreenSmall = false;

  
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ){
  }

  ngOnInit(): void {
    this.decodeToken();
    this.onButtonClick(0);
    this.cargarDatosDeUsuario();
  }

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 720px)'])
      .subscribe((result) => {
        this.isScreenSmall = result.matches;
      });
  }

  decodeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userId = decoded.userId;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  cargarDatosDeUsuario() :void{
    const decoded: DecodedToken = jwtDecode(this.authService.getToken() || '');
    if ('userId' in decoded && 'sub' in decoded && 'roles' in decoded) {
      this.userId = decoded.userId;
      if (this.userId) {
        this.cargarChacrasUsuario();
      }
    }
  }

   cargarChacrasUsuario(): void {
    this.apiService.getFields(this.userId).subscribe(
      (response) => {
        if (response.list && response.list.length > 0) {
          const campos: any[] = response.list[0];
          const loteObservables: any = []
          campos.forEach((campo, i)=>{
            this.hectareasTotal += campo.dimensions
            this.chacras.push({
              id: campo.id,
              name: campo.name,
              dimension: campo.dimensions,
              lotes: []
              
            })
            loteObservables.push(this.loadDataLote(campo.id, this.userId, i));
            
          })
          forkJoin(loteObservables).subscribe(() => {
            console.log(this.chacras);
            this.crearObjetoGraficoBarras();
            this.crearObjetoPorPlantacion();
            
        });
        } else {
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
  }  

  crearObjetoPorPlantacion() :void {
    this.chacras.forEach(e=>{
      if (e.lotes?.length>0){
        e.lotes.forEach(cultivo=>{
          let match: boolean = false
          let position: number= 0
          for (let index = 0; index < this.objetoPlantaciones.length; index++) {
            if (this.objetoPlantaciones[index].id === cultivo.plantacion.id){
              match= true
              position = index
              break
            }
          }
          if (!match){
            this.objetoPlantaciones.push({
              id: cultivo.plantacion.id,
              name: cultivo.plantacion.name,
              chacra: [{
                name: e.name,
                lote: {
                  name: cultivo.name,
                  size: cultivo.dimension
                }
              }]
            })
          }else{
            this.objetoPlantaciones[position].chacra?.push({
              name: e.name,
                lote: {
                  name: cultivo.name,
                  size: cultivo.dimension
                }
            })
          }

        })
      }
    })
    console.log(this.objetoPlantaciones);
    this.crearObjetoGraficoTorta()

    // habilita los botones y muestra la primer tabla
    this.buttonsDisabled=false;
    this.showBarChart=1
    this.selectedButtonId=1
  }

  loadDataLote(FieldId: number, userId: number, chacraArray: number): Observable<any> {
    if (userId && FieldId) {
        return this.apiService.getPlotsOperador(userId, FieldId).pipe(
            tap((response: any) => {
                if (response?.list && response.list?.length > 0) {
                    const lotsArray: Lote[] = response.list[0];
                    lotsArray.forEach(e => {
                        this.chacras[chacraArray].lotes?.push({
                            id: e.id,
                            dimension: e.dimensions,
                            name: e.name,
                            plantacion: {
                                id: e.typeCrop.id,
                                name: e.typeCrop.name
                            }
                        });
                    });
                }
            }),
            catchError((error) => {
                console.error('Error al cargar los lotes:', error);
                return of(null); // Retorna un observable vacío en caso de error
            })
        );
    } else {
        console.warn('El userId o el FieldId son null o undefined, por lo que no se cargan los lotes.');
        return of(null); // Retorna un observable vacío si no hay ID o campo
    }
  }


  // botones superiores
  onButtonClick(arg: number): void {
    this.selectedButtonId = arg;
    this.showBarChart = arg;
 
    // cambio de los titulos
    if (arg === 2) {
      this.displayedColumns = ['chacra', 'lote', 'hectárea'];
    } else {
        this.displayedColumns = ['name', 'typeCropName', 'dimensions'];
    }
  }

  // cambio de cursor en el grafico
  changeCursorOnHover(event: ChartEvent, chartElement: ActiveElement[]): void {
    const nativeEvent = event.native as MouseEvent;
    (nativeEvent.target as HTMLElement).style.cursor = chartElement.length ? 'pointer' : 'default';
  }

  // grafico de barras

  crearObjetoGraficoBarras(): void{
    this.chacras.forEach(e=>{
      this.campoTabla.push({label:e.name, data: [e.dimension], backgroundColor:'#0F8054'})
    })
    this.barChartData.datasets = this.campoTabla.map(e => {return e});
  }
  
  onChartClick(event: ChartEvent, active: ActiveElement[]): void {
    this.datasetIndex = active[0].datasetIndex;
    const data: DataLotes[] | null = this.chacras[this.datasetIndex].lotes || [];
    this.dataSourceBar.data = data;
    this.cdr.detectChanges();
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar la relación de aspecto
    aspectRatio: 1 / 2, // Relación de aspecto de 1:2 (ancho:alto) para un gráfico más alto
    plugins: {
      title: {
        display: true,
        text: '  Detalle de chacras',
        font: {
          size: 16
        },
        align: 'start'
      }
    },
    onClick: this.onChartClick.bind(this),
    onHover: this.changeCursorOnHover
  };

  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Hectareas'],
    datasets:this.campoTabla.map(e=>({...e}))
  };


 // grafico de torta

  crearObjetoGraficoTorta(): void {
    const predefinedColors = ['#0F8054', '#3BA549', '#34833E', '#20b520']; //colores para el Pie Productores
    // const predefinedColors = ['#015E83', '#a0c9d9', '#6bb4c8']; //colores para el Pie Backoffice
    const backgroundColors = this.objetoPlantaciones.map((_, i) => predefinedColors[i % predefinedColors.length]); // asignamos un color random
 
    this.pieChartData = {
      labels: this.objetoPlantaciones.map(item => item.name),
      datasets: [{ data: this.objetoPlantaciones.map(item => item.chacra.length), backgroundColor: backgroundColors }]
    };
  }

  onPieChartClick(event: ChartEvent, active: ActiveElement[]): void {
    this.datasetIndexPie = active[0].index;
    const data: ChacraPieChart[] | null = this.objetoPlantaciones[this.datasetIndexPie].chacra || [];
    this.dataSourcePie.data = data;
    this.cdr.detectChanges();
  }

  public pieChartData: ChartData<'pie'> = { 
      labels: [],
      datasets:this.campoTabla.map(e=>({...e}))
    };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: this.changeCursorOnHover,
    onClick: this.onPieChartClick.bind(this),
  };


  volver() {
    this.router.navigate(['dashboard/inicio']);
  }

  limpiar(){

  }
  buscar(){

  }
  generar(){

  }

}

// import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
// import { ApiService } from 'src/app/services/ApiService';
// import { ActiveElement, ChartConfiguration, ChartData, ChartEvent, ChartOptions } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';
// import { MatTableDataSource } from '@angular/material/table';
// import { catchError, forkJoin, Observable, of, tap } from 'rxjs';
// import { BreakpointObserver } from '@angular/cdk/layout';
 
// interface DataChacras{
//   id: number;
//   name: string;
//   dimension: number;
//   lotes: DataLotes[];
// }
 
// interface DataLotes {
//   id: number;
//   name: string;
//   dimension: number;
//   plantacion: Plantacion;
// }
 
// interface Plantacion {
//   id: number;
//   name: string;
// }
 
// interface Lote {
//   id: number;
//   name: string;
//   descriptions: string;
//   dimensions: number;
//   typeCrop: {
//     id: number;
//     name: string;
//   };
//   url_profile: string | null;
//   plant_name?: string;
//   type_crop_id?: number;
// }
 
// interface PieChart {
//   name: string;
//   id: number;
//   chacra: ChacraPieChart[]
// }
 
// interface ChacraPieChart {
//   name: string;
//   lote: LotePieChart
// }
 
// interface LotePieChart {
//   name: string;
//   size: number;
// }
 
// @Component({
//   selector: 'app-informes',
//   templateUrl: './informes.component.html',
//   styleUrls: ['./informes.component.sass']
// })
// export class InformesComponent implements OnInit {
//   @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
 
//   isScreenSmall = false;
//   buttonsDisabled: boolean = true;
 
//   displayedColumns: string[] = [ 'name', 'typeCropName', 'dimensions'];
//   dataSource: MatTableDataSource<DataLotes> = new MatTableDataSource<DataLotes>([]);
//   objetoPlantaciones: PieChart[] = []
//   dataSourcePie: MatTableDataSource<ChacraPieChart> = new MatTableDataSource<ChacraPieChart>([]);
 
//   public selectedProductorId: number = 0;
//   selectedButtonId: number | null = null;
//   showBarChart: number = 1;
//   selectedFieldId: number | null = null;
//   chacrasLength: number | string = '-';
//   plantacionesLength: number | string = '-';
 
//   usuarios: any[] = [];
//   campos: any[] = [];
//   loteData: any[] = [];
//   loteDataLength: number = 0;
//   typeCropArray: { name: string, value: number }[] = [];
 
//   chacras: DataChacras[] = [];
//   campoTabla: any[] = [];
 
//   // grafico torta
//   public pieChartData: ChartData<'pie'> = {
//     labels: [],
//     datasets: [{ data: [] }]
//   };
 
//   public pieChartOptions: ChartOptions<'pie'> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       title: {
//         display: true,
//         text: '  Detalle de plantaciones',
//         font: {
//           size: 16
//         },
//         align: 'start'
//       }
//     },
//     onHover: this.changeCursorOnHover,
//     onClick: this.onPieChartClick.bind(this),
//   };
 
//   // grafico de barras
//   public barChartData: ChartConfiguration<'bar'>['data'] = {
//     labels: [ 'Hectareas'  ],
//     datasets:[]
//   };
 
//   public barChartOptions: ChartConfiguration<'bar'>['options'] = {
//     responsive: true,
//     maintainAspectRatio: false, // Permite ajustar la relación de aspecto
//     aspectRatio: 1 / 2, // Relación de aspecto de 1:2 (ancho:alto) para un gráfico más alto
//     plugins: {
//       title: {
//         display: true,
//         text: '  Detalle de chacras',
//         font: {
//           size: 16
//         },
//         align: 'start'
//       }
//     },
//     onClick: this.onBarChartClick.bind(this),
//     onHover: this.changeCursorOnHover
//   };
 
//   constructor(
//     private breakpointObserver: BreakpointObserver,
//     public dashboardBackOffice: DashboardBackOfficeService,
//     private apiService: ApiService,
//     private cdr: ChangeDetectorRef
//   ) {
//     this.dashboardBackOffice.dataTitulo.next({ titulo: 'Informes', subTitulo: '' });
//   }
 
//   ngOnInit(): void {
//     this.traerUsuarios();
//     this.onButtonClick(1);
//   }
 
//   ngAfterViewInit(): void {
//     this.breakpointObserver
//       .observe(['(max-width: 720px)'])
//       .subscribe((result) => {
//         this.isScreenSmall = result.matches;
//       });
//   }
 
//   traerUsuarios(locationId?: number): void {
//     this.apiService.getPeopleAdmin(locationId).subscribe(
//       (data: any) => {
//         if (data.list && data.list.length > 0) {
//           this.usuarios = data.list.flat().map((usuario: any) => ({
//             id: usuario.id,
//             name: usuario.name,
//             lastName: usuario.lastname,
//           }));
//         }
//       },
//       (error) => console.error('Error al obtener los usuarios:', error)
//     );
//   }
 
//   cargarCampos() {
//     this.chacras = [];
//     this.apiService.getFields(this.selectedProductorId).subscribe(
//       (response) => {
//         if (response.list && response.list.length > 0) {
//           const campos: any[] = response.list[0];
//           this.chacrasLength = campos.length;
//           const loteObservables: any = []
//           campos.forEach((campo, i)=>{
//             this.chacras.push({
//               id: campo.id,
//               name: campo.name,
//               dimension: campo.dimensions,
//               lotes: []
//             })
//             loteObservables.push(this.loadDataLote(campo.id, this.selectedProductorId, i));          
//           })
//           forkJoin(loteObservables).subscribe(() => {
//             this.cargarDatosBarChart();
//             this.graficoTorta();
//           });
         
//         } else {
//           console.error('La lista de campos está vacía o no está definida');
//         }
//       },
//       (error) => {
//         console.error('Error al obtener campos:', error);
//       }
//     );
//   }
 
//   loadDataLote(FieldId: number, selectedProductorId: number, chacraArray: number): Observable<any> {
//     if (selectedProductorId && FieldId) {
//         return this.apiService.getPlotsOperador(selectedProductorId, FieldId).pipe(
//           tap((response: any) => {
//               if (response?.list && response.list?.length > 0) {
//                 const lotsArray: Lote[] = response.list[0];                
//                 lotsArray.forEach(e => {
//                     this.chacras[chacraArray].lotes?.push({
//                         id: e.id,
//                         dimension: e.dimensions,
//                         name: e.name,
//                         plantacion: {
//                             id: e.typeCrop.id,
//                             name: e.typeCrop.name
//                         }
//                     });
//                 });
                 
//               }
//           }),
//           catchError((error) => {
//             console.error('Error al cargar los lotes:', error);
//             return of(null); // Retorna un observable vacío en caso de error
//           })
//         );
//     } else {
//       console.warn('El userId o el FieldId son null o undefined, por lo que no se cargan los lotes.');
//       return of(null); // Retorna un observable vacío si no hay ID o campo
//     }
//   }
 
//   graficoTorta(){
//     this.objetoPlantaciones=[]
//     this.chacras.forEach(e=>{
//       if (e.lotes?.length>0){
//         e.lotes.forEach(cultivo=>{
//           let match: boolean = false
//           let position: number= 0
//           for (let index = 0; index < this.objetoPlantaciones.length; index++) {
//             if (this.objetoPlantaciones[index].id === cultivo.plantacion.id){
//               match= true
//               position = index
//               break
//             }
//           }
//           if (!match){
//             this.objetoPlantaciones.push({
//               id: cultivo.plantacion.id,
//               name: cultivo.plantacion.name,
//               chacra: [{
//                 name: e.name,
//                 lote: {
//                   name: cultivo.name,
//                   size: cultivo.dimension
//                 }
//               }]
//             })
//           }else{
//             this.objetoPlantaciones[position].chacra?.push({
//               name: e.name,
//                 lote: {
//                   name: cultivo.name,
//                   size: cultivo.dimension
//                 }
//             })
//           }
 
//         })
//       }
//     })
//     this.crearObjetoGraficoTorta()
//     this.plantacionesLength= this.objetoPlantaciones.length
 
//     // habilita los botones y muestra la primer tabla
//     this.buttonsDisabled = false;
//     this.showBarChart = 1;
//     this.selectedButtonId = 1;
//   }
 
//   crearObjetoGraficoTorta(): void {
//     const predefinedColors = ['#015E83', '#a0c9d9', '#6bb4c8']; //colores para el Pie Backoffice
//     const backgroundColors = this.objetoPlantaciones.map((_, i) => predefinedColors[i % predefinedColors.length]); // asignamos un color random
   
//     this.pieChartData = {
//       labels: this.objetoPlantaciones.map(item => item.name),
//       datasets: [{ data: this.objetoPlantaciones.map(item => item.chacra.length), backgroundColor: backgroundColors }]
//     };
//   }
 
//   cargarDatosBarChart(){
//     this.campoTabla = [];
//     this.chacras.forEach(e=>{
//       this.campoTabla.push({label:e.name, data: [e.dimension], backgroundColor:'#015E83'})
//     })
 
//     if(this.campoTabla.length > 0){
//       this.barChartData.datasets = this.campoTabla.map(e => ({...e}));
//       this.chart?.update(); // Actualiza el gráfico
//     }
//   }
 
//   // seleccion de productor
//   onProductorChange(productorId: number): void {
//     this.selectedProductorId = productorId;
//     if (productorId) {
//       this.cargarCampos();
//     }
//   }
 
//   // botones superiores
//   onButtonClick(arg: number): void {
//     this.selectedButtonId = arg;
//     this.showBarChart = arg;
 
//     // cambio de los titulos de la tabla
//     if (arg === 2) {
//       this.displayedColumns = ['chacra', 'lote', 'hectárea'];
//     } else {
//         this.displayedColumns = ['name', 'typeCropName', 'dimensions'];
//     }
//   }
 
//   // seleccion del grafico
//   onBarChartClick(event: ChartEvent, active: ActiveElement[]): void {
//     const datasetIndex = active[0].datasetIndex;
//     const data: DataLotes[] | null = this.chacras[datasetIndex].lotes || [];
 
//     this.dataSource.data = data;
//     this.cdr.detectChanges();
//   }
 
//   onPieChartClick(event: ChartEvent, active: ActiveElement[]): void {
//     const datasetIndex = active[0].index;
//     const data: ChacraPieChart[] | null = this.objetoPlantaciones[datasetIndex].chacra || [];
   
//     this.dataSourcePie.data = data;
//     this.cdr.detectChanges();
//   }
 
//   // cambio de cursor en el grafico
//   changeCursorOnHover(event: ChartEvent, chartElement: ActiveElement[]): void {
//     const nativeEvent = event.native as MouseEvent;
//     (nativeEvent.target as HTMLElement).style.cursor = chartElement.length ? 'pointer' : 'default';
//   }
// }