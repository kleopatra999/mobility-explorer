import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id', 'serves', 'operated_by', 'vehicle_type', 'style_routes_by'],
	bbox: null,
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	queryIsInactive: false,
	onestop_id: null,
	serves: null,
	operated_by: null,
	vehicle_type: null,
	style_routes_by: null,
	selectedRoute: null,
	place: null,
	onlyRoute: Ember.computed('onestop_id', function(){
		var data = this.get('routes');
		var onlyRoute = data.get('firstObject');
		if (this.get('onestop_id') === null){
			return null
		} else {
			return onlyRoute;
		}
	}),
	hoverRoute: null,
	unstyledColor: "blue",
	bounds: Ember.computed('bbox', function(){
		if (this.get('bbox') === null){
			var defaultBoundsArray = [];
			defaultBoundsArray.push([37.706911598228466, -122.54287719726562]);
			defaultBoundsArray.push([37.84259697150785, -122.29568481445312]);
			return defaultBoundsArray;
		} else {
			var coordinateArray = [];
			var bboxString = this.get('bbox');
			var tempArray = [];
			var boundsArray = [];

			coordinateArray = bboxString.split(',');

			for (var i = 0; i < coordinateArray.length; i++){
				tempArray.push(parseFloat(coordinateArray[i]));
			}
		
			var arrayOne = [];
			var arrayTwo = [];
			arrayOne.push(tempArray[1]);
			arrayOne.push(tempArray[0]);
			arrayTwo.push(tempArray[3]);
			arrayTwo.push(tempArray[2]);
			boundsArray.push(arrayOne);
			boundsArray.push(arrayTwo);
			return boundsArray;
		}
	}),
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',		
		iconSize: (20, 20)
	}),
	routes: Ember.computed('model', function(){
		var data = this.get('model');
		var routes = [];
		routes = routes.concat(data.map(function(route){return route;}));
		return routes;
	}),
	routeStyleIsMode: Ember.computed('style_routes_by', function(){
		return (this.get('style_routes_by') === 'mode');
	}),
	routeStyleIsOperator: Ember.computed('style_routes_by', function(){
		return (this.get('style_routes_by') === 'operator');
	}),
	actions: {
		updateLeafletBbox(e) {
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
			// this.set('queryIsInactive', false);
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
			// this.set('queryIsInactive', true);
		},
		setRouteStyle(style){
			if (this.get('style_routes_by') === style){
  			this.set('style_routes_by', null);
  		} else {
  			this.set('style_routes_by', style);
  		}
		},
		setRoute(route){
			var onestop_id = route.get('id');
			this.set('onestop_id', onestop_id);
			this.set('selectedRoute', route);
		},
		selectRoute(route){
			this.set('selectedRoute', null);
			route.set('route_path_opacity', 1);
			route.set('route_path_weight', 3);
			this.set('hoverRoute', route);
		},
		unselectRoute(route){
			route.set('route_path_opacity', 0.5);
			route.set('route_path_weight', 1.5);
			this.set('hoverRoute', null);
		},
		selectUnstyledRoute(route){
			this.set('selectedRoute', null);
			route.set('route_path_opacity', 1);
			route.set('route_path_weight', 3);
			this.set('hoverRoute', route);
			route.set('default_color', "red");
		},
		unselectUnstyledRoute(route){
			route.set('route_path_opacity', 0.5);
			route.set('route_path_weight', 1.5);
			this.set('hoverRoute', null);
			route.set('default_color', "blue");
		},
		setOnestopId(route) {
			var onestopId = route.id;
			this.set('onestop_id', onestopId);
			this.set('selectedRoute', route);
			this.set('serves', null);
			this.set('operated_by', null);
		},
		setPlace: function(selected){
  		this.set('place', selected);
  		this.set('bbox', selected.bbox);
  		this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox')}});
  	},
		// setPlace(selected){
  //   	var newbbox = selected.bbox;
  //   	this.transitionToRoute('index', {queryParams: {bbox: newbbox}});
  // 	},
  	clearPlace(){
  		this.set('place', null);
  	},
		searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&sources=wof&text=${term}`;
      return Ember.$.ajax({ url }).then(json => json.features);
    }
  }
	
});