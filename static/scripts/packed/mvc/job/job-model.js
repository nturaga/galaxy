define(["mvc/history/history-contents","mvc/dataset/states","utils/ajax-queue","mvc/base-mvc","utils/localization"],function(f,a,c,b,e){var h=b.SearchableModelMixin;var d=Backbone.Model.extend(b.LoggableMixin).extend(b.mixin(h,{defaults:{model_class:"Job",tool:null,exit_code:null,inputs:{},outputs:{},params:{},create_time:null,update_time:null,state:a.NEW},initialize:function(i,j){this.debug(this+"(Job).initialize",i,j);this.outputCollection=i.outputCollection||new f.HistoryContents([]);this._setUpListeners()},_setUpListeners:function(){this.on("change:state",function(j,i){this.log(this+" has changed state:",j,i);if(this.inReadyState()){this.trigger("state:ready",j,i,this.previous("state"))}})},inReadyState:function(){return _.contains(a.READY_STATES,this.get("state"))},hasDetails:function(){return _.isEmpty(this.get("outputs"))},urlRoot:((window.galaxy_config&&galaxy_config.root)?(galaxy_config.root):("/"))+"api/jobs",searchAttributes:["tool"],toString:function(){return["Job(",this.get("id"),":",this.get("tool_id"),")"].join("")}}));var g=Backbone.Collection.extend(b.LoggableMixin).extend({model:d,urlRoot:((window.galaxy_config&&galaxy_config.root)?(galaxy_config.root):("/"))+"api/jobs",url:function(){return this.urlRoot},intialize:function(j,i){console.debug(j,i)},ids:function(){return this.map(function(i){return i.get("id")})},notReady:function(){return this.filter(function(i){return !i.inReadyState()})},haveDetails:function(){return this.all(function(i){return i.hasDetails()})},queueDetailFetching:function(){var j=this,i=new c.AjaxQueue(this.map(function(k){return function(){return k.fetch({silent:true})}}));i.done(function(){j.trigger("details-loaded")});return i},matches:function(i){return this.filter(function(j){return j.matches(i)})},set:function(k,i){var j=this;k=_.map(k,function(m){if(!j.get(m.id)){return m}var l=existing.toJSON();_.extend(l,m);return l});Backbone.Collection.prototype.set.call(this,k,i)},toString:function(){return(["JobCollection(",this.length,")"].join(""))}},{fromHistory:function(j){console.debug(this);var i=this,k=new i([]);k.fetch({data:{history_id:j}}).done(function(){window.queue=k.queueDetailFetching()});return k}});return{Job:d,JobCollection:g}});