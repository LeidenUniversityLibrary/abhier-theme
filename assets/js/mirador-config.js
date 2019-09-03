var mir;
searchAnno = function(annoId) {
    var annotations = mir.viewer.workspace.slots[0].window.annotationsList.filter(function(item) {return item.fullId === annoId;});
    if (annotations.length > 0) {
        return annotations[0];
    } else {
        return null;
    }
}

zoomAnno = function(annoId) {
    var anno = searchAnno(annoId);
    if (anno != null) {
        var fragment = anno.on[0].selector.default.value;
        var parts = fragment.slice(5).split(',');
        mir.eventEmitter.publish('fitBounds.the_window', {'x': parts[0], 'y': parts[1], 'width': parts[2], 'height': parts[3]});
    }
}
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
    var parsedUrl = new URL(window.location.href);
    var param = parsedUrl.searchParams.get("anno");
    if (param != null) {
        try {
            zoomAnno(param);
        } catch (error) {
            console.error(error);
        }
    }
});