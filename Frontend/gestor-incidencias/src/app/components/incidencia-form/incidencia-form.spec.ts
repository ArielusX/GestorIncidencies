import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaForm } from './incidencia-form';

describe('IncidenciaForm', () => {
  let component: IncidenciaForm;
  let fixture: ComponentFixture<IncidenciaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidenciaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidenciaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
