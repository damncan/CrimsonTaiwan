/**
 * TeammatesController
 *
 * @description :: Server-side logic for managing teammates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res){
		res.view("teammates/index", {
			scripts: [
			],
            stylesheets: [
            ]
        });
	},
};

