define("mvc/workflow/workflow-terminals",["exports"],function(t){"use strict";function e(t){this.collectionType=t,this.isCollection=!0,this.rank=t.split(":").length}Object.defineProperty(t,"__esModule",{value:!0}),window.workflow_globals=window.workflow_globals||{};var n={isCollection:!1,canMatch:function(t){return!1},canMapOver:function(t){return!1},toString:function(){return"NullCollectionType[]"},append:function(t){return t},equal:function(t){return t===this}},i={isCollection:!0,canMatch:function(t){return n!==t},canMapOver:function(t){return!1},toString:function(){return"AnyCollectionType[]"},append:function(t){throw"Cannot append to ANY_COLLECTION_TYPE_DESCRIPTION"},equal:function(t){return t===this}};$.extend(e.prototype,{append:function(t){return t===n?this:t===i?otherCollectionType:new e(this.collectionType+":"+t.collectionType)},canMatch:function(t){return t!==n&&(t===i||t.collectionType==this.collectionType)},canMapOver:function(t){if(t===n)return!1;if(t===i)return!1;if(this.rank<=t.rank)return!1;var e=t.collectionType;return this._endsWith(this.collectionType,e)},effectiveMapOver:function(t){var n=t.collectionType;return new e(this.collectionType.substring(0,this.collectionType.length-n.length-1))},equal:function(t){return t.collectionType==this.collectionType},toString:function(){return"CollectionType["+this.collectionType+"]"},_endsWith:function(t,e){return-1!==t.indexOf(e,t.length-e.length)}});var o=Backbone.Model.extend({initialize:function(t){this.mapOver=t.mapOver||n,this.terminal=t.terminal,this.terminal.terminalMapping=this},disableMapOver:function(){this.setMapOver(n)},setMapOver:function(t){this.mapOver=t,this.trigger("change")}}),c=Backbone.Model.extend({initialize:function(t){this.element=t.element,this.connectors=[]},connect:function(t){this.connectors.push(t),this.node&&this.node.markChanged()},disconnect:function(t){this.connectors.splice($.inArray(t,this.connectors),1),this.node&&(this.node.markChanged(),this.resetMappingIfNeeded())},redraw:function(){$.each(this.connectors,function(t,e){e.redraw()})},destroy:function(){$.each(this.connectors.slice(),function(t,e){e.destroy()})},destroyInvalidConnections:function(){_.each(this.connectors,function(t){t&&t.destroyIfInvalid()})},setMapOver:function(t){this.multiple||this.mapOver().equal(t)||(this.terminalMapping.setMapOver(t),_.each(this.node.output_terminals,function(e){e.setMapOver(t)}))},mapOver:function(){return this.terminalMapping?this.terminalMapping.mapOver:n},isMappedOver:function(){return this.terminalMapping&&this.terminalMapping.mapOver.isCollection},resetMapping:function(){this.terminalMapping.disableMapOver()},resetMappingIfNeeded:function(){}}),a=c.extend({initialize:function(t){c.prototype.initialize.call(this,t),this.datatypes=t.datatypes},resetMappingIfNeeded:function(){this.node.hasConnectedOutputTerminals()||this.node.hasConnectedMappedInputTerminals()||_.each(this.node.mappedInputTerminals(),function(t){t.resetMappingIfNeeded()}),!this.node.hasMappedOverInputTerminals()&&this.resetMapping()},resetMapping:function(){this.terminalMapping.disableMapOver(),_.each(this.connectors,function(t){var e=t.handle2;e&&(e.resetMappingIfNeeded(),t.destroyIfInvalid())})}}),r=c.extend({initialize:function(t){c.prototype.initialize.call(this,t),this.update(t.input)},canAccept:function(t){return!this._inputFilled()&&this.attachable(t)},resetMappingIfNeeded:function(){this.mapOver().isCollection&&(this.node.hasConnectedMappedInputTerminals()||!this.node.hasConnectedOutputTerminals())&&this.resetMapping()},resetMapping:function(){this.terminalMapping.disableMapOver(),this.node.hasMappedOverInputTerminals()||_.each(this.node.output_terminals,function(t){t.resetMapping()})},connected:function(){return 0!==this.connectors.length},_inputFilled:function(){var t;return this.connected()?this.multiple?this._collectionAttached()?inputsFilled=!0:t=!1:t=!0:t=!1,t},_collectionAttached:function(){if(this.connected()){var t=this.connectors[0].handle1;return!!t&&!!(t.isCollection||t.isMappedOver()||t.datatypes.indexOf("input_collection")>0)}return!1},_mappingConstraints:function(){if(!this.node)return[];var t=this.mapOver();if(t.isCollection)return[t];var e=[];return this.node.hasConnectedOutputTerminals()?e.push(_.first(_.values(this.node.output_terminals)).mapOver()):_.each(this.node.connectedMappedInputTerminals(),function(t){e.push(t.mapOver())}),e},_producesAcceptableDatatype:function(t){for(var e in this.datatypes){var n=this.datatypes[e];if("input"==n)return!0;var i=new Array;if(i=i.concat(t.datatypes),t.node.post_job_actions)for(var o in t.node.post_job_actions){var c=t.node.post_job_actions[o];"ChangeDatatypeAction"!=c.action_type||""!=c.output_name&&c.output_name!=t.name||!c.action_arguments||i.push(c.action_arguments.newtype)}for(var a in i){var r=i[a];if("input"==r||"_sniff_"==r||"input_collection"==r||window.workflow_globals.app.isSubType(i[a],n))return!0}}return!1},_otherCollectionType:function(t){var e=n;t.isCollection&&(e=t.collectionType);var i=t.mapOver();return i.isCollection&&(e=i.append(e)),e}}),s=r.extend({update:function(t){this.datatypes=t.extensions,this.multiple=t.multiple,this.collection=!1},connect:function(t){r.prototype.connect.call(this,t);var e=t.handle1;if(e){var n=this._otherCollectionType(e);n.isCollection&&this.setMapOver(n)}},attachable:function(t){var e=this._otherCollectionType(t),n=this.mapOver();return e.isCollection?this.multiple?!(this.connected()&&!this._collectionAttached())&&(1==e.rank&&this._producesAcceptableDatatype(t)):n.isCollection&&n.canMatch(e)?this._producesAcceptableDatatype(t):!!this._mappingConstraints().every(_.bind(e.canMatch,e))&&this._producesAcceptableDatatype(t):!n.isCollection&&this._producesAcceptableDatatype(t)}}),l=r.extend({update:function(t){this.multiple=!1,this.collection=!0,this.datatypes=t.extensions;var n=[];t.collection_types?_.each(t.collection_types,function(t){n.push(new e(t))}):n.push(i),this.collectionTypes=n},connect:function(t){r.prototype.connect.call(this,t);var e=t.handle1;if(e){var n=this._effectiveMapOver(e);this.setMapOver(n)}},_effectiveMapOver:function(t){var e=this.collectionTypes,i=this._otherCollectionType(t);if(!_.some(e,function(t){return t.canMatch(i)}))for(var o in e){var c=e[o];if(i.canMapOver(c)){var a=i.effectiveMapOver(c);if(a!=n)return a}}return n},_effectiveCollectionTypes:function(){var t=this.mapOver();return _.map(this.collectionTypes,function(e){return t.append(e)})},attachable:function(t){var e=this._otherCollectionType(t);if(e.isCollection){var n=this._effectiveCollectionTypes(),i=this.mapOver();if(_.some(n,function(t){return t.canMatch(e)}))return this._producesAcceptableDatatype(t);if(i.isCollection)return!1;if(_.some(this.collectionTypes,function(t){return e.canMapOver(t)})){var o=this._effectiveMapOver(t);if(!o.isCollection)return!1;if(this._mappingConstraints().every(o.canMatch))return this._producesAcceptableDatatype(t)}}return!1}}),p=c.extend({initialize:function(t){c.prototype.initialize.call(this,t),this.datatypes=t.datatypes,t.collection_type?this.collectionType=new e(t.collection_type):(t.collection_type_source||console.log("Warning: No collection type or collection type source defined."),this.collectionType=i),this.isCollection=!0},update:function(t){var n;t.collection_type?n=new e(t.collection_type):(t.collection_type_source||console.log("Warning: No collection type or collection type source defined."),n=i),n.collectionType!=this.collectionType.collectionType&&_.each(this.connectors,function(t){t.destroy()}),this.collectionType=n}});t.default={InputTerminal:s,OutputTerminal:a,InputCollectionTerminal:l,OutputCollectionTerminal:p,TerminalMapping:o,CollectionTypeDescription:e,NULL_COLLECTION_TYPE_DESCRIPTION:n,ANY_COLLECTION_TYPE_DESCRIPTION:i}});
//# sourceMappingURL=../../../maps/mvc/workflow/workflow-terminals.js.map
