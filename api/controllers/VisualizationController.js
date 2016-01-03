/**
 * VisualizationController
 *
 * @description :: Server-side logic for managing visualizations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res){
		res.view("visualization/index", {
			scripts: [
				'//d3js.org/d3.v3.min.js',
				'//d3js.org/topojson.v1.min.js',
				'http://bost.ocks.org/mike/fisheye/fisheye.js?0.0.3',
				'/js/visualization/main.js'
			],
            stylesheets: [
            	'/styles/visualization/main.css'
            ]
        });
	},
};

