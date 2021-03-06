import { NgModule } from "@angular/core";
import {RouterModule, Routes} from "@angular/router"
import { LoginComponent } from "./auth/sign-in/login.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: PostCreateComponent},
  {path: 'edit/:postId', component: PostCreateComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
