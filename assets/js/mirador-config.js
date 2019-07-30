var mir;
$(function() {
    mir = Mirador({
        id: "viewer",
        buildPath: my_object.buildPath,
        data: [{manifestUri: my_object.manifestUri, location: "Louvre"}],
        mainMenuSettings: { show: false },
        windowObjects: [{
            loadedManifest: my_object.manifestUri,
            canvasID: my_object.canvasID,
            displayLayout: false,
            bottomPanel: false,
            bottomPanelAvailable: false,
            bottomPanelVisible: false,
            sidePanel: false,
            id: "the_window",
            viewType: "ImageView",
            availableViews:  ['ImageView'],
        }],
        availableAnnotationDrawingTools: [
        'Rectangle', 'Ellipse', 'Polygon'
        ],
        annotationEndpoint: {
        name: 'WordPress Endpoint',
        module: 'WordPressEndpoint',
        options: {
            url: my_object.endpointUrl,
            nonce: my_object.nonce,
            userid: my_object.userid,
            username: my_object.username,
            userrole: my_object.userrole,
        }
        }
    });
    if (false) {
        console.log('before emit');
        console.log(mir.viewer);
        console.log(mir.eventEmitter);
        //var wid = mir.viewer.workspace.slots[0].window.id;
        var wid = "the_window";
        mir.eventEmitter.subscribe('annotationListLoaded.the_window', function(event) { console.log('received annolist loaded'); });
        mir.eventEmitter.subscribe('fitBounds.the_window', function(event, bounds) { console.log('received fitBounds'); });
        mir.eventEmitter.subscribe('imageBoundsUpdated', function(event, data) { 
            $.map(data.osdBounds, function(item, i) { 
            console.log('new bounds: ' + item); 
            }) 
        });
        console.log(wid);
        mir.eventEmitter.publish('fitBounds.'+wid, {'x': 0, 'y': 0, 'width': 200, 'height': 200});
        console.log('after emit');
    }
});