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
import { ActiveElement, ChartConfiguration, ChartData, ChartEvent, ChartOptions, Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver } from '@angular/cdk/layout';

Chart.register(...registerables, ChartDataLabels);
 
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
  totalSize: number;
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
  private colors: string[] = ['#00668F','#929497','#3BA549','#F79721','#000000']

  
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
        
        if (response.list && response.list[0].length > 0) {
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
              totalSize:cultivo.dimension,
              chacra: [{
                name: e.name,
                lote: {
                  name: cultivo.name,
                  size: cultivo.dimension
                }
              }]
            })
          }else{
            this.objetoPlantaciones[position].totalSize += cultivo.dimension
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
    this.crearObjetoGraficoTorta()
    this.crearObjetoGraficoTortaHectareas()

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
    this.dataSourcePie.data = []
 
    // cambio de los titulos
    if (arg === 2 || arg === 3) {
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
    this.chacras.forEach((e)=>{
      this.barChartData.labels?.push(e.name)
      this.barChartData.datasets[0].data.push(e.dimension)
    })
  }
  
  onChartClick(event: ChartEvent, active: ActiveElement[]): void {
    this.datasetIndex = active[0]?.index;
    const data: DataLotes[] | null = this.chacras[this.datasetIndex]?.lotes || [];
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
      },
      datalabels: {
        display: true,
        anchor: 'center',
        align: 'center',
        color: 'white',
        font: {
          size: 16,
          family: 'Arial, sans-serif'
        },
      }
    },
    onClick: this.onChartClick.bind(this),
    onHover: this.changeCursorOnHover,
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets:[{data:[], backgroundColor: this.colors, label:'Hectareas '}]
  };


 // grafico de torta plantaciones

  crearObjetoGraficoTorta(): void {
    const backgroundColors = this.objetoPlantaciones.map((_, i) => this.colors[i % this.colors.length]); // asignamos un color random
 
    this.pieChartData = {
      labels: this.objetoPlantaciones.map(item => item.name),
      datasets: [{ data: this.objetoPlantaciones.map(item => item.chacra.length), backgroundColor: backgroundColors, label: 'Cantidad de lotes',
       }]
    };
  }

  onPieChartClick(event: ChartEvent, active: ActiveElement[]): void {
    this.datasetIndexPie = active[0]?.index;
    const data: ChacraPieChart[] | null = this.objetoPlantaciones[this.datasetIndexPie]?.chacra || [];
    this.dataSourcePie.data = data;
    this.cdr.detectChanges();
  }

  public pieChartData: ChartData<'pie'> = { 
      labels: [],
      datasets:[]
    };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: this.changeCursorOnHover,
    onClick: this.onPieChartClick.bind(this),
    plugins: {
      legend: {
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 5,
        }
      },
      datalabels: {
        display: true,
        anchor: 'center',
        align: 'center',
        color: 'white',
        font: {
          size: 16,
          family: 'Arial, sans-serif'
        },
        formatter: (value, context) => {
          const total = (context.dataset.data as number[]).reduce((acc, val) => acc + val, 0);
          return `${Math.round((value / total) * 100)}%`;
        }
      }
    },
  };

  // grafico de torta hectareas

  crearObjetoGraficoTortaHectareas(): void {
    const backgroundColors = this.objetoPlantaciones.map((_, i) => this.colors[i % this.colors.length]); // asignamos un color random
 
    this.pieChartDataHectareas = {
      labels: this.objetoPlantaciones.map(item => item.name),
      datasets: [{ data: this.objetoPlantaciones.map(item => item.totalSize), backgroundColor: backgroundColors, label:'Hecareas ' }]
    };
  }

  onPieChartSizeClick(event: ChartEvent, active: ActiveElement[]): void {
    this.datasetIndexPie = active[0]?.index;
    const data: ChacraPieChart[] | null = this.objetoPlantaciones[this.datasetIndexPie]?.chacra || [];
    this.dataSourcePie.data = data;
    this.cdr.detectChanges();
  }

  public pieChartDataHectareas: ChartData<'pie'> = { 
      labels: [],
      datasets:[]
    };

  public pieChartOptionsHectareas: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: this.changeCursorOnHover,
    onClick: this.onPieChartSizeClick.bind(this),
    plugins: {
      legend: {
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 5,
        }
      },
      datalabels: {
        display: true,
        anchor: 'center',
        align: 'center',
        color: 'white',
        font: {
          size: 16,
          family: 'Arial, sans-serif'
        },
        formatter: (value, context) => {
          const total = (context.dataset.data as number[]).reduce((acc, val) => acc + val, 0);
          return `${Math.round((value / total) * 100)}%`;
        }
      }
    },
  };

  volver() {
    this.router.navigate(['dashboard/inicio']);
  }

}