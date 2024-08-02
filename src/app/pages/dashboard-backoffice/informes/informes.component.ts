import { Component, OnInit } from '@angular/core';
import { DashboardBackOfficeService } from '../dashboard-backoffice.service';
import { ApiService } from 'src/app/services/ApiService';
import { ChartData, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.sass']
})
export class InformesComponent implements OnInit {
  public typeCrop: number = 0;
  campos: any[] = [];
  loteData: any[] = [];
  loteDataLength: number = 0;
  typeCropOperators: string[] = [];
  public typeCropCounts: { [key: string]: number } = {};
  public typeCropArray: { name: string, value: number }[] = [];
  usuarios: { name: string; lastName: string; location: string, dni:number, email:string }[] = [];

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor(
    public dashboardBackOffice: DashboardBackOfficeService,
    private apiService: ApiService,
  ) {
    this.dashboardBackOffice.dataTitulo.next({ titulo: 'Informes', subTitulo: '' });
  }

  ngOnInit(): void {
    this.traerUsuarios();
    this.cargarChacras();
    this.traerLotes();
  }

  
  traerUsuarios(locationId?: number) {
    this.apiService.getPeopleAdmin(locationId).subscribe(
      (data: any) => {
        if (data.list && data.list.length > 0) {
          const usuariosList = data.list.flat();
          this.usuarios = usuariosList.map((usuario: any) => ({
            id: usuario.id,
            name: usuario.name,
            lastName: usuario.lastname,
            dni: usuario.dni,
            email: usuario.userEmail,
            telephone: usuario.telephone,
            location: usuario.location.name,
            descriptions: usuario.descriptions
          }));
        }
        console.log(this.usuarios);
        
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  cargarChacras(): void {
    this.apiService.getUsersFields(0, 10, 'id', 'desc').subscribe(
      (res: any) => {
        this.campos = res.list[0].length;
      },
      (error) => {
        console.error('Error al cargar chacras:', error);
      }
    );
  }

  traerLotes(): void {
    this.apiService.getAllPlotsAdmin().subscribe(
      (res: any) => {
        this.loteData = res.list[0];
        this.loteDataLength = this.loteData.length;
        this.extractTypeCrop();
      },
      (error) => {
        console.error('Error al traer lotes:', error);
      }
    );
  }

  extractTypeCrop(): void {
    const typeCropSet = new Set<string>(); // Set para almacenar tipos únicos
    const typeCropCounts: { [key: string]: number } = {};

    this.loteData.forEach(lote => {
      const typeName = lote.typeCrop.name;

      typeCropSet.add(typeName); // Añadimos el tipo de cultivo al Set (solo valores únicos)

      // Conteo de tipos de cultivos repetidos
      if (typeCropCounts[typeName]) {
        typeCropCounts[typeName]++;
      } else {
        typeCropCounts[typeName] = 1;
      }
    });

    this.typeCropOperators = Array.from(typeCropSet); // Convertimos el Set a un Array para obtener una lista
    this.typeCropCounts = typeCropCounts;

    this.typeCropArray = Object.entries(this.typeCropCounts).map(([name, value]) => ({ name, value }));

    this.cargarDatosTorta();
    console.log(this.typeCropArray); 
  }

  cargarDatosTorta(): void {
    this.pieChartData = {
      labels: this.typeCropArray.map(item => item.name),
      datasets: [
        {
          data: this.typeCropArray.map(item => item.value)
        }
      ]
    };
  }
}
