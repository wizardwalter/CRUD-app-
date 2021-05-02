import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../models/post.model';
import { PostService } from '../services/post.service';
import {mimeType} from './mime-type.validator'



@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  isLoading= false
  private mode = 'create';
  private postId: string;
  post: Post;
  form: FormGroup;
  imagePreview: string;

  constructor(public postService: PostService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null,{validators:[Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators:[Validators.required]}),
      image: new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if( paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData =>{
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagepath: postData.imagePath
          };
          this.isLoading = false;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagepath
          })
        });
      } else{
        this.mode = 'create';
        this.postId = null;
      }
    })
  };

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  onSavePost(){
    if(this.form.invalid){
      return
    };
    this.isLoading = true
    if(this.mode ==='create'){
      this.postService.addPosts(this.form.value.title, this.form.value.content, this.form.value.image);
    }else{
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
    }

   this.form.reset();
  }

}
