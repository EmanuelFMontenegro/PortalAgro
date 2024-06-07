import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CargarLotesComponent } from './cargar-lotes.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

describe('CargarLotesComponent', () => {
  let component: CargarLotesComponent;
  let fixture: ComponentFixture<CargarLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CargarLotesComponent],
      imports: [ReactiveFormsModule], // Agrega ReactiveFormsModule a los imports
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarLotesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component).toBeTruthy();

    // Verifica que loteForm esté inicializado antes de acceder a sus propiedades
    expect(component.loteForm).toBeTruthy();

    if (component.loteForm) {
      // Verifica los valores iniciales del formulario
      expect(component.loteForm.get('dimensions').value).toEqual('');
      expect(component.loteForm.get('observation').value).toEqual('');
      expect(component.loteForm.get('plantation').value).toEqual('');
    } else {
      // Si loteForm es null o undefined, muestra un mensaje de error
      fail('loteForm is null or undefined');
    }
  });

  // Agrega más pruebas según sea necesario
});
