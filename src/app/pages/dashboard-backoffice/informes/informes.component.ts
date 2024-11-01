import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
import { ApiService } from 'src/app/services/ApiService';
import { Chart, ActiveElement, ChartConfiguration, ChartData, ChartEvent, ChartOptions, registerables  } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, forkJoin, Observable, of, tap } from 'rxjs';
import { WidgetConfig } from '../../../models/widget.models';

Chart.register(...registerables, ChartDataLabels);



/* 
lo que seria diseño esta finalizado.
Quedo pendiente separar la logica de los charts en un servicio y crear un componente para el renderizado
Widget y Table se separaron en componentes para reutilizarlos.
Se puede customizar mas aun el widget : en proximo update  sacare el selectedbuttonId y se usara la interface del mismo. 

*/


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
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  selectedProductorName = '';
  // Variables de estado
  buttonsDisabled: boolean = true;
  selectedButtonId: number = 0;
  datasetIndex: any = 0
  datasetIndexPie: any = 0

  // Datos para tablas
  dataSource: MatTableDataSource<DataLotes> = new MatTableDataSource<DataLotes>([]);
  dataSourcePie: MatTableDataSource<ChacraPieChart> = new MatTableDataSource<ChacraPieChart>([]);

  // Datos para gráficos
  colors: string[] = ['#015E83', '#F79721', '#3BA549', '#929497', '#000000' ];
  objetoPlantaciones: PieChart[] = [];
  chacras: DataChacras[] = [];
  campoTabla: any[] = [];

  // Datos específicos
  selectedProductorId: number = 0;
  selectedFieldId: number | null = null;
  selectedFieldName: string = ""
  selectedPlantationName: string = ""
  selectedPlantationNameHectarea: string = "";
  chacrasLength: number = 0
  plantacionesLength: number = 0
  totalDimensionSum: number = 0
  widgetIds = [1, 2, 3];
  usuarios: any[] = [];
  campos: any[] = [];
  loteData: any[] = [];
  loteDataLength: number = 0;
  typeCropArray: { name: string, value: number }[] = [];

  // grafico torta
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public pieChartDataHectareas: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 5,
        }
      },
      title: {
        display: true,
        text: '  Detalle de plantaciones',
        font: {
          size: 16,
          family: 'Arial, sans-serif', 
          weight: 'bold' 
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
        formatter: (value, context) => {
          const total = (context.dataset.data as number[]).reduce((acc, val) => acc + val, 0);
          return `${Math.round((value / total) * 100)}%`;
        }
      }
    },
    onHover: this.changeCursorOnHover,
    onClick: this.onPieChartClick.bind(this),
  };

  public pieChartHectareasOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 5,
        }
      },
      title: {
        display: true,
        text: '  Detalle de plantaciones',
        font: {
          size: 16,
          family: 'Arial, sans-serif', 
          weight: 'bold' 
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
        formatter: (value, context) => {
          const total = (context.dataset.data as number[]).reduce((acc, val) => acc + val, 0);
          return `${Math.round((value / total) * 100)}%`;
        }
      }
    },
    onHover: this.changeCursorOnHover,
    onClick: this.onPieChartSizeClick.bind(this),
  };

  // grafico de barras
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Hectareas' ],
    datasets:[{data:[], backgroundColor: '#015E83', label:'hectáreas ',borderColor: '#015E83'}]
  };
  
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1 / 2,
    //bar width
    
    plugins: {
      legend: {
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          padding: 5,
        }
      },
      title: {
        display: true,
        text: '  Detalle de chacras',
        font: {
          size: 16,
          family: 'Arial, sans-serif', 
          weight: 'bold' 
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
    onClick: this.onBarChartClick.bind(this),
    onHover: this.changeCursorOnHover
  };

  constructor(
    public dashboardBackOffice: DashboardBackOfficeService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.dashboardBackOffice.dataTitulo.next({ titulo: 'Informes', subTitulo: '' });
  }

  ngOnInit(): void {
    this.getUsers();
     
  }


  cargarCampos() {
    this.chacras = [];
    this.apiService.getFields(this.selectedProductorId).subscribe(
      (response) => { 
        if (response.list && response.list.length > 0) {
          const campos: any[] = response.list[0];
          this.chacrasLength = campos.length;
          const loteObservables: any = []
          campos.forEach((campo, i)=>{
            this.chacras.push({
              id: campo.id,
              name: campo.name,
              dimension: campo.dimensions,
              lotes: []
            })
            loteObservables.push(this.cargarDataLote(campo.id, this.selectedProductorId, i));           
            
          })
          
          forkJoin(loteObservables).subscribe(() => {
            this.cargarDatosBarChart();
            this.cargarDatosPieChart();
           
          }); 
        } else {
          this.resetData();
          console.error('La lista de campos está vacía o no está definida');
        }
      },
      (error) => {
        console.error('Error al obtener campos:', error);
      }
    );
  } 
  cargarDataLote(FieldId: number, selectedProductorId: number, chacraArray: number): Observable<any> {
    if (!selectedProductorId || !FieldId) {
      console.warn('El userId o el FieldId son null o undefined, por lo que no se cargan los lotes.');
      return of(null); 
    }
  
    return this.apiService.getPlotsOperador(selectedProductorId, FieldId).pipe(
      tap((response: any) => {
        if (response?.list?.length > 0) {
          const lotsArray: Lote[] = response.list[0];
          this.chacras[chacraArray].lotes = lotsArray.map(e => ({
            id: e.id,
            dimension: e.dimensions,
            name: e.name,
            plantacion: {
              id: e.typeCrop.id,
              name: e.typeCrop.name
            }
          })); 
        }
      }),
      catchError((error) => {
        console.error('Error al cargar los lotes:', error);
        return of(null); 
      })
    );
  }
  

  cargarDatosPieChart() {
    const plantacionList: any[] = [];
  
    this.chacras.forEach(chacra => {
      chacra.lotes?.forEach(cultivo => {
        const plantacionId = cultivo.plantacion.id;
        this.totalDimensionSum += cultivo.dimension;
        let plantacion = plantacionList.find(p => p.id === plantacionId);

        if (!plantacion) {
          plantacion = {
            id: plantacionId,
            name: cultivo.plantacion.name,
            chacra: []
          };
          plantacionList.push(plantacion);
        }
  
        plantacion.chacra.push({
          name: chacra.name,
          lote: {
            name: cultivo.name,
            size: cultivo.dimension
          }
        });
      });
    });
  
    this.objetoPlantaciones = plantacionList;
    this.crearObjetoPlantacion();
    this.crearObjetoHectarea();
    this.plantacionesLength = this.objetoPlantaciones.length;
    this.buttonsDisabled = false;
    this.selectedButtonId = 1;
  }
  

  cargarDatosBarChart() {
    this.chacras.forEach((e) => {
      this.barChartData.labels?.push(e.name);
      this.barChartData.datasets[0].data.push(e.dimension);
      this.barChartData.datasets[0].barThickness = 50;
      this.barChartData.datasets[0].maxBarThickness = 50; 
    });
  }
  
  
  crearObjetoPlantacion(): void {
    this.pieChartData = {
      labels: this.objetoPlantaciones.map(item => item.name),
      datasets: [{ 
        data: this.objetoPlantaciones.map(item => item.chacra.length), 
        label: 'Cantidad de lotes', 
        backgroundColor: this.colors 
      }]
    };
  }

  crearObjetoHectarea(): void { 
    this.pieChartDataHectareas = {
      labels: this.objetoPlantaciones.map(item => item.name),
      datasets: [{ 
        data: this.objetoPlantaciones.map(item => item.chacra.reduce((total, chacra) => total + chacra.lote.size, 0)), 
        backgroundColor: this.colors, 
        label:'Hectáreas ',

      }]
    };
  }
 
  onPieChartSizeClick(event: ChartEvent, active: ActiveElement[]): void {
    this.datasetIndexPie = active[0]?.index;
    const data: ChacraPieChart[] | null = this.objetoPlantaciones[this.datasetIndexPie]?.chacra || [];
    this.dataSourcePie.data = data;
    this.selectedPlantationNameHectarea = this.objetoPlantaciones[this.datasetIndexPie]?.name;
    this.cdr.detectChanges();
  }

  // seleccion del grafico
  onBarChartClick(event: ChartEvent, active: ActiveElement[]): void {
    if (active?.length) {
      this.datasetIndex = active[0]?.index;
      const data: DataLotes[] = this.chacras[this.datasetIndex]?.lotes || [];
      this.dataSource.data = data;
      
      this.selectedFieldName = this.chacras[this.datasetIndex]?.name
      this.cdr.detectChanges();
    }
  }
  
  onPieChartClick(event: ChartEvent, active: ActiveElement[]): void {
    if (active?.length) {
      const { index } = active[0];
      this.selectedPlantationName = this.objetoPlantaciones[index]?.name || '';
      this.dataSourcePie.data = this.objetoPlantaciones[index]?.chacra || [];
      this.cdr.detectChanges();
    }
  }  
  
  // cambio de cursor en el grafico
  changeCursorOnHover(event: ChartEvent, chartElement: ActiveElement[]): void {
    const nativeEvent = event.native as MouseEvent;
    (nativeEvent.target as HTMLElement).style.cursor = chartElement.length ? 'pointer' : 'default';
  }

  


/* Funciones de carga y seleccion de usuarios */

getUsers(locationId?: number): void {
  this.apiService.getPeopleAdmin(locationId).subscribe(
    (data: any) => {
      if (data.list && data.list.length > 0) {
        this.usuarios = data.list.flat().map((usuario: any) => ({
          id: usuario.id,
          name: usuario.name,
          lastName: usuario.lastname,
        }));
        //seteamos por default 1 user
        this.selectedProductorId = this.usuarios[0]?.id;
        this.selectedProductorName = this.usuarios[0]?.name;
        this.onProductorChange(this.selectedProductorId);
      }
    },
    (error) => console.error('Error al obtener los usuarios:', error)
  );
}
 
onProductorChange(productorId: number): void {
  this.resetData()
  this.selectedProductorId = productorId;
  this.selectedProductorName = this.usuarios.find((usuario) => usuario.id === productorId)?.name || '';
  if (productorId) {
    this.cargarCampos();
  }
}


/* Funciones para El componente de widget
   Cada caso es un widget, que tiene sus datos preseteados 
   cada vez que se hace click en algun widget, hace un toggle en las props baseconfig*/
  getWidgetConfig(widgetId: number): WidgetConfig {
    const baseConfig = {
      widgetId,
      isSelected: this.selectedButtonId === widgetId,
      isDisabled: this.buttonsDisabled
    };

    switch (widgetId) {
      case 1:
        return {
          ...baseConfig,
          title: 'Chacras',
          value: this.chacrasLength,
          iconSrc: 'assets/img/img-chacra-azul.svg'
        };
      case 2:
        return {
          ...baseConfig,
          title: 'Plantaciones',
          value: this.plantacionesLength,
          iconSrc: 'assets/img/img-plantaciones.svg'
        };
      case 3:
        return {
          ...baseConfig,
          title: 'Hectáreas',
          value: this.totalDimensionSum,
          iconSrc: 'assets/img/img-chacra-azul.svg'
        };
      default:
        throw new Error('Widget no válido');
    }
  }
  
 
  onButtonClick(widgetId: any): void {
    this.selectedButtonId = widgetId;
  }


  /* Reset data general */
  resetData(): void {
    this.selectedButtonId = 0
    this.chacrasLength = 0
    this.plantacionesLength = 0
    this.totalDimensionSum = 0
    this.dataSource.data.length = 0
    this.dataSourcePie.data.length = 0
    this.selectedFieldName = ""
    this.selectedPlantationName = ""

    this.barChartData.labels = [];
    this.barChartData.datasets[0].data.length = 0

    this.pieChartDataHectareas = {
      labels: [],
      datasets: [{ data: [] }]
    };
    this.pieChartData = {
      labels: [],
      datasets: [{ data: [] }]
    }
  }


}