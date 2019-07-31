/*
 * Edited version of https://github.com/IIIF/mirador/blob/9e3c6bbb894e044d01ad51aae1b70309939de5a9/js/src/annotations/catchEndpoint.js
 * This module tries to store the annotation as is in a RDF store but some fiddeling is required.
 * Fidles are:
 * - delete annotation fails if id has a / in it so have to send sanatised ids to mirador
 * - mirador requires an endpoint variable in the annotation pointing to this class.
 *
 * Note: this endpoint should support authentication using WordPress cookies and a WordPress nonce.
 *
 * All Endpoints need to have at least the following:
 * annotationsList - current list of OA Annotations
 * dfd - Deferred Object
 * init()
 * search(uri)
 * create(oaAnnotation, returnSuccess, returnError)
 * update(oaAnnotation, returnSuccess, returnError)
 * deleteAnnotation(annotationID, returnSuccess, returnError) (delete is a reserved word)
 *
 */
(function ($){

$.WordPressEndpoint = function (options) {

  jQuery.extend(this, {
        nonce: null,
        // prefix:    'annotation', /**/
        uri: null,
        url: options.url,
        dfd: null,
        // WordPress user ID
        userid: null,
        // WordPress username
        username: null,
        // WordPress user role
        userrole: null,
        // OA list for Mirador use
        annotationsList: [],
        // internal list for module use to map id to URI
        idMapper: {}
    }, options);

    this.init();
  };

  $.WordPressEndpoint.prototype = {
    // Any set up for this endpoint, and triggers a search of the URI passed to object
    init: function () {
      this.catchOptions = {
        user: {
          id: this.userid,
          name: this.username
        },
        permissions: {
          'read':   [],
          'update': [this.userid],
          'delete': [this.userid],
          'admin': [this.userid]
        }
      };
    },

    /**
     * Search endpoint for all annotations with a given URI
     * @param {*} options 
     * @param {*} successCallback 
     * @param {*} errorCallback 
     */
    search: function (options, successCallback, errorCallback) {
      var _this = this;

      this.annotationsList = []; // clear out current list
      jQuery.ajax({
        url: _this.url + '/search',
        cache: false,
        type: 'GET',
        dataType: 'json',
        headers: {
          'X-WP-Nonce': this.nonce
        },
        data: {
          uri: options.uri,
          media: 'image',
          limit: 10000
        },

        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          _this.annotationsList = data; // gmr
          jQuery.each(_this.annotationsList, function(index, value) {
            // Swap out URI of anno to shorter ID
            value.fullId = value['@id'];
            value['@id'] = $.genUUID();
            _this.idMapper[value['@id']] = value.fullId;
            value.endpoint = _this;
            // Ensure on is an array
            _this.fixOn(value);
          });
          if (typeof successCallback === 'function') {
            successCallback(data);
          } else {
            _this.dfd.resolve(true);
          }
        },
        error: function(xhr, statusText, err) {
          if (typeof errorCallback === 'function') {
            errorCallback();
          } else {
            _this.dfd.reject();
            console.log('The request for annotations has caused an error for endpoint: ' + options.uri + ' due to ' + statusText);
          }
        },
        complete: function(xhr, textStatus) {
            console.log("New nonce: " + xhr.getResponseHeader('X-WP-Nonce'));
            this.nonce = xhr.getResponseHeader('X-WP-Nonce');
        }

      });
    },

    fixOn: function (annotation) {
      var oldOn;
      if (annotation && annotation.on && !jQuery.isArray(annotation.on) && annotation.on.selector && annotation.on.selector.default) {
        oldOn = annotation.on;
        annotation.on = [oldOn];
      }
    },

    /**
     * Delete an annotation by its ID
     * @param {*} annotationID 
     * @param {*} returnSuccess 
     * @param {*} returnError 
     */
    deleteAnnotation: function (annotationID, returnSuccess, returnError) {
      var _this = this;
      jQuery.ajax({
        url: _this.url + '/destroy?uri=' + encodeURIComponent(_this.idMapper[annotationID]),
        type: 'DELETE',
        dataType: 'json',
        headers: {
            'X-WP-Nonce': this.nonce
        },
        data: {
          uri: annotationID,
        },
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          if (typeof returnSuccess === 'function') {
            returnSuccess();
          }
        },
        error: function(xhr, statusText, err) {
          if (typeof returnError === 'function') {
            returnError();
          } else {
            console.log('Failed to delete annotation ' + annotationID + ' due to ' + statusText);
          }
        },
        complete: function(xhr, textStatus) {
            console.log("New nonce: " + xhr.getResponseHeader('X-WP-Nonce'));
            this.nonce = xhr.getResponseHeader('X-WP-Nonce');
        }

      });
    },

    /**
     * Update an annotation on the server.
     * @param {Object} oaAnnotation 
     * @param {*} returnSuccess 
     * @param {*} returnError 
     */
    update: function (oaAnnotation, returnSuccess, returnError) {
      var annotation = oaAnnotation;
      var _this = this;
      // slashes don't work in JQuery.find which is used for delete
      // so need to switch http:// id to full id and back again for delete.
      var shortId = annotation['@id'];
      var annotationID = annotation.fullId;// annotation['@id'];
      annotation['@id'] = annotation.fullId;
      delete annotation.fullId;
      delete annotation.endpoint;
      jQuery.ajax({
        url: _this.url + '/update',
        type: 'POST',
        dataType: 'json',
        headers: {
            'X-WP-Nonce': this.nonce
        },
        data: JSON.stringify(annotation),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          _this.fixOn(data);
          if (typeof returnSuccess === 'function') {
            returnSuccess(data);
          }
        },
        error: function(xhr, statusText, err) {
          if (typeof returnError === 'function') {
            returnError();
          } else {
            console.log('Failed to update annotation: ' + oaAnnotation['@id'] + ' due to ' + statusText);
          }
        },
        complete: function(xhr, textStatus) {
            console.log("New nonce: " + xhr.getResponseHeader('X-WP-Nonce'));
            this.nonce = xhr.getResponseHeader('X-WP-Nonce');
        }
      });
      // this is what updates the viewer
      annotation.endpoint = _this;
      annotation.fullId = annotation['@id'];
      annotation['@id'] = shortId;
    },

    /**
     * Create an annotation on the server
     * @param {*} oaAnnotation 
     * @param {*} returnSuccess 
     * @param {*} returnError 
     */
    create: function (oaAnnotation, returnSuccess, returnError) {
      var annotation = oaAnnotation;
      var _this = this;

      jQuery.ajax({
        url: _this.url + '/create',
        type: 'POST',
        dataType: 'json',
        headers: {
            'X-WP-Nonce': this.nonce
        },
        data: JSON.stringify(annotation),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          data.fullId = data['@id'];
          data['@id'] = $.genUUID();
          data.endpoint = _this;
          _this.idMapper[data['@id']] = data.fullId;
          _this.fixOn(data);
          if (typeof returnSuccess === 'function') {
            returnSuccess(data);
          }
        },
        error: function(xhr, statusText, err) {
          if (typeof returnError === 'function') {
            returnError();
          } else {
            console.log('Failed to create annotation: ' + oaAnnotation['@id'] + ' due to ' + statusText);
          }
        },
        complete: function(xhr, textStatus) {
            console.log("New nonce: " + xhr.getResponseHeader('X-WP-Nonce'));
            this.nonce = xhr.getResponseHeader('X-WP-Nonce');
        }
      });
    },

    set: function (prop, value, options) {
      if (options) {
        this[options.parent][prop] = value;
      } else {
        this[prop] = value;
      }
    },

    /**
     * Determine whether this user is allowed to perform an action on an annotation.
     * 
     * This only checks information that is available on the client side;
     * the server may still disagree with the result.
     * @param {string} action 
     * @param {*} annotation 
     */
    userAuthorize: function (action, annotation) {
        //if this is an editor or administrator, they have access to all annotations
        if (this.roles && (this.roles.indexOf('Editor') !== -1 || this.roles.indexOf('Administrator') !== -1)){
            console.log('User is editor or administrator; action %s is allowed', action);
            return true;
        }
        //otherwise check annotation permissions
        if (annotation.permissions) {
            var permissionUserIds = annotation.permissions[action] || [];
            //if no userids set for a permission, it is open to everyone
            if (permissionUserIds.length === 0) {
                console.log('No restrictions set for action %s on %O', action, annotation);
                return true;
            }
            //otherwise compare userid of annotation to current userid
            if (permissionUserIds.indexOf(this.userid) !== -1) {
                console.log('User is allowed to perform action %s on %O', action, annotation);
                return true;
            }
            return false;
        } else if (annotation.user) {
            //if no permissions, just check userids
            console.log('Checking that current user is the annotator of %O', annotation);
            return this.userid === annotation.user.userid;
        }
        //otherwise, just return true
        console.info('Allowing action %s on %O because of default setting', action, annotation);
        return true;
    }
  };
}(Mirador));
