import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, take } from 'rxjs';
import { IRecipe } from 'src/models/recipe.interface';
import { RecipeService } from 'src/services/recipe.service';

@Component({
    selector: 'app-detail-page',
    templateUrl: './detail-page.component.html',
    styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {
    public recipe: IRecipe | null = null;
    
    constructor(
        public recipeService: RecipeService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    public recipe$ = combineLatest([
        this.activatedRoute.paramMap,
        this.recipeService.recipes$
    ]).pipe(
        map(
            ([paramMap, recipes]) =>
            {
                return recipes.filter((_recipe) => _recipe.id == paramMap.get("recipeId"))[0];
           }     
        )
    );
        
    ngOnInit(): void {
        this.activatedRoute.paramMap
        .pipe(take(1))
        .subscribe(
            (paramMap) =>
            {
                let recipe = this.recipeService.get(paramMap.get("recipeId") ?? "");
                if (recipe)
                {
                    this.recipe = recipe;
                }
            }
        );
    }

    public remove(recipe): void
    {
        this.recipeService.remove(recipe);
        this.router.navigateByUrl("/");
    }
}
        