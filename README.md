# YelpCamp
An application for discovering and populating campground sites. It allows users to view campground sites by location and view descriptions, price, and reviews of a campground. Upon login or registering, users can create, edit, and delete their own campground and add reviews and ratings to campground sites. 

## Deployed on **Heroku**: [yelpCamp-app-api](https://hidden-peak-81499.herokuapp.com/)

### Campground Schema
#### When creating a new campground the minimum required is:

###### Request Body:
```
{
	title: String,
	location: String,
	price: Number,
}
```

###### Returns:
```
{   "_id" : ObjectId("#####"), 
    "geometry" : { 
                    "coordinates" : [ #####, ##### ], 
                    "type" : "Point" 
                }, 
    "reviews" : [ ], 
    "author" : ObjectId("#####"), 
    "location" : "Cicero, Illinois", 
    "title" : "Enchanting Lake", 
    "description" : "Lorem ipsum dolor sit amet.", 
    "price" : ##, 
    "images" : [ 
                {   
                    "_id" : ObjectId("#####"), 
                    "url" : "https://res.cloudinary.com/#####", 
                    "filename" : "YelpCamp/#####" 
                }, 
            ]
}
```

### Campground Schema
#### When creating a new campground the minimum required is:

###### Request Body:
```
{
	title: String,
	location: String,
	price: Number,
}
```

###### Returns:
```
{   "_id" : ObjectId("#####"), 
    "geometry" : { 
                    "coordinates" : [ #####, ##### ], 
                    "type" : "Point" 
                }, 
    "reviews" : [ ], 
    "author" : ObjectId("#####"), 
    "location" : "Cicero, Illinois", 
    "title" : "Enchanting Lake", 
    "description" : "Lorem ipsum dolor sit amet.", 
    "price" : ##, 
    "images" : [ 
                {   
                    "_id" : ObjectId("#####"), 
                    "url" : "https://res.cloudinary.com/#####", 
                    "filename" : "YelpCamp/#####" 
                }, 
            ]
}
```

## Reviews Schema
#### When creating a review the minimum required is:

###### Request Body:
```
{
	body: String,
	rating: Number,
}
```

###### Returns:
```
{ 
    "_id" : ObjectId("#####"), 
    "rating" : 5, 
    "body" : "Great Location!", 
    "author" : ObjectId("#####")
}
```

## Endpoints

| Route | Method | Endpoint | Description | Required |
|:-------:|:--------:|----------|-------------|----------|
| **Campgrounds** | GET | /campgrounds | Returns a list of campgrounds | No auth required |
|            | POST | /campgrounds/new | Returns a form to create a new campground | auth |
|            | GET | /campgrounds/:id | Returns specified campground by id | No auth required |
|            | PUT | /campgrounds/:id | Updates a specified campground by id | auth |
|            | DELETE | /campgrounds/:id | Deletes a specified campground by id | auth |
|            | GET | /campgrounds/:id/edit | Returns a form to create a campground | auth |
| **Reviews**  | POST | /campgrounds/:id/reviews | Posts a review to a campground | auth |
|            | DELETE | /campgrounds/:id/reviews/:reviewId | Deletes the specified review | auth |
| **Users**   | GET | /register | Returns a form to create a new user | No auth |
|            | POST | /register | Creates a new user | email, username, password |
|            | POST | /login | Returns a success message indicating user is logged in | username, password |
|            | GET | /logout | Logs a user out | auth |