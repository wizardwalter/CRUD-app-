import { Component, OnDestroy, OnInit } from '@angular/core';
import {Post} from '../models/post.model';
import {PostService} from '../services/post.service';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
 isLoading = false;
 posts: Post[] = [];
 totalPosts = 10;
 postPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1,2,5,10];
 private postSub: Subscription;

  constructor(public postService: PostService) { }

  ngOnInit() {
  this.isLoading= true;
  this.postService.getPosts(this.postPerPage, this.currentPage);
   this.postSub = this.postService.getPostUpdateListener().subscribe((postData: {posts:Post[], postCount: number} )=>{
    this.isLoading = false;
    this.totalPosts = postData.postCount;
    this.posts = postData.posts;
    })
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  };

  onDelete(postId: string){
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() =>{
      this.postService.getPosts(this.postPerPage, this.currentPage)
    });
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
}
