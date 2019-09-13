# PeepzApi
A little study using Spring Data REST and React+Redux+ReduxObservable+RxJS

# About the App
As a quick study, the functionality is pretty rudamentary. It just lists "Users" and displays them on a page. You can add, update or delete users. Data is updated automatically by dispatching actions to a Redux store where changes are then pushed back down to React components using Redux Connect.

Actions which result in side effects are handled by Redux Observable "epics." Epics expose RxJS Observables and the over arching rule is "Observables in, Observables out." Wrapped in the observables are actions or sequences of actions. Actions in contain payloads which mutate data and actions out contain payloads which change the state of the store. The actions out are handled by Redux reducers which mutate the state of the store.

That was a bit about the front end. Now for the back end... Well, it's Spring Boot with REST Repositories. Very low drama. Some custom context configuration was added to hydrate test data from randomuser.org. Since the database is in-memory, the data is destroyed with every restart so a new set of fake data is fetched each time the app boots. This process is handled by the Spring REST template (builder) and the results are transformed into the domain model (entity). No custom serialzer/deserializer was used. Just straight-forward JsonNode from the Jackson Databind library.

## Prerequisites
- Java 8
- A modern version of NodeJS (v8.11.2 was used here)
- Redis running on port 6379

## The Stack
- Java 8
- Spring
  - Spring Boot
  - Spring Data JPA
  - Spring Data Repositories
  - Spring Data Rest Repositories
- Redis
- H2 in-memory SQL database
- Gradle
- Bootstrap 4
  - Simple custom theme (downloaded)
- ReactJS
  - Redux
  - Redux Observable
  - Reactstrap (React components for Bootstrap 4)
 - WebPack
 - ES6
 - ...and really no custom styles (SASS is used lightly)

## Pull it
To get the project started up do the following:
```
git clone git@github.com:techroller/PeepzApi.git
```  
## Build it
Then build the front end. The front end app lives in the java app. As a quick study, it didn't make sense to create a node app for the front end and a Java app for the API.
```
cd src/main/resources/static/app
```

Then build the front app. Note, you need NodeJS installed.
```
npm install
npm run build
```
## Run it
Now start the java app by going back to the root directory and running gradlew. As a Java app running on localhost
```
gradlew build
gradlw bootRun
```

Navigate to http://localhost:8080 and enjoy!
