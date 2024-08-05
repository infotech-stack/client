import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelSettingsComponent } from './admin-panel-settings.component';

describe('PagesComponent', () => {
  let component: AdminPanelSettingsComponent;
  let fixture: ComponentFixture<AdminPanelSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPanelSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPanelSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
