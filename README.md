# rocket-launch-worldmap
Rocket Launch Worldmap showcases D3.js and Three.js ability to work together, utilizing an open source API for displaying upcoming rocket launches in their corresponding country.

Currently, it displays rocket launches coming in the next month with a limit of 10 launches.  The reason for the limiation is due to Google Maps API only allowing you to request 10 times per second.  

See [live example](http://davidbiga.io/rocket-launch-worldmap/)

# Future Optimizations
1. Get away from Google Maps API for getting correct country naming convention and use own local mapping object
2. Display all returned scheduled launches for date period
3. Add ability for user to choose what dates they see launches
4. Add info screen when clicking on country to display a list of the scheduled rocket launches with more detailed information
5. Maybe add states to the USA and show more precise rocket launch locations within that country.

# Documentation/How-To-Use
TBC

# resources used
1. [THREE.js](http://mrdoob.github.com/three.js/)
2. [D3.js](http://d3js.org/)
3. [worldMap](https://github.com/ftorghele/worldMap)
4. [Launch Library](https://launchlibrary.net/)
5. [Google Maps API](https://developers.google.com/maps/documentation/geocoding/intro)
