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
            canvasControls: {
                annotations: {
                    annotationCreation: my_object.annotationCreation,
                }
            }
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
});