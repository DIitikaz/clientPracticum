import { Routes } from '@angular/router';
import { EditWorkerComponent } from './edit-worker/edit-worker.component';

export const routes: Routes = [
    
        {path:'', component:EditWorkerComponent},
        {
		path: 'edit',
		 component:EditWorkerComponent
	}
];
