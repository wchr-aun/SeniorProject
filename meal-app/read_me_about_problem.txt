
CategoryMealsScreen isn't re-render when navigating-back to it:
    for the above situation, then there is a problem that the header-right-star isn't updated when navigating forward and back between CategoryMealsScreen ( have <MealLsit />) and MealDetailScreen. On the other hand, go back to the CategoryScreen and navigate forward to the MealDetailScreen again, it's work
so I think the navigation back button doesn't force the screen will be re-rendered.
How can I solve it instead of using this approach