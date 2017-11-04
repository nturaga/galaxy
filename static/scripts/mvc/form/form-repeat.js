define("mvc/form/form-repeat",["exports","utils/utils","mvc/ui/ui-portlet","mvc/ui/ui-misc"],function(t,e,i,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(t,"__esModule",{value:!0});var s=o(e),l=o(i),a=o(n),d=Backbone.View.extend({initialize:function(t){this.list={},this.options=s.default.merge(t,{title:"Repeat",empty_text:"Not available.",max:null,min:null}),this.button_new=new a.default.ButtonIcon({icon:"fa-plus",title:"Insert "+this.options.title,tooltip:"Add new "+this.options.title+" block",cls:"ui-button-icon ui-clear-float form-repeat-add",onclick:function(){t.onnew&&t.onnew()}}),this.setElement($("<div/>").append(this.$list=$("<div/>")).append($("<div/>").append(this.button_new.$el)))},size:function(){return _.size(this.list)},add:function(t){if(t.id&&!this.list[t.id]){var e=new a.default.ButtonIcon({icon:"fa-trash-o",tooltip:"Delete this repeat block",cls:"ui-button-icon-plain form-repeat-delete",onclick:function(){t.ondel&&t.ondel()}}),i=new l.default.View({id:t.id,title:"placeholder",cls:t.cls||"ui-portlet-repeat",operations:{button_delete:e}});i.append(t.$el),i.$el.addClass("section-row").hide(),this.list[t.id]=i,this.$list.append(i.$el.fadeIn("fast")),this.options.max>0&&this.size()>=this.options.max&&this.button_new.disable(),this._refresh()}else Galaxy.emit.debug("form-repeat::add()","Duplicate or invalid repeat block id.")},del:function(t){this.list[t]?(this.$list.find("#"+t).remove(),delete this.list[t],this.button_new.enable(),this._refresh()):Galaxy.emit.debug("form-repeat::del()","Invalid repeat block id.")},delAll:function(){for(var t in this.list)this.del(t)},hideOptions:function(){this.button_new.$el.hide(),_.each(this.list,function(t){t.hideOperation("button_delete")}),_.isEmpty(this.list)&&this.$el.append($("<div/>").addClass("ui-form-info").html(this.options.empty_text))},_refresh:function(){var t=0;for(var e in this.list){var i=this.list[e];i.title(++t+": "+this.options.title),i[this.size()>this.options.min?"showOperation":"hideOperation"]("button_delete")}}});t.default={View:d}});
//# sourceMappingURL=../../../maps/mvc/form/form-repeat.js.map
