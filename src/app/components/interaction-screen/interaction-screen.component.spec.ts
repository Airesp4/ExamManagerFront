import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionScreenComponent } from './interaction-screen.component';

describe('InteractionScreenComponent', () => {
  let component: InteractionScreenComponent;
  let fixture: ComponentFixture<InteractionScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractionScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
