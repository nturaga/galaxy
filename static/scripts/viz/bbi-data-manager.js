define("viz/bbi-data-manager",["exports","viz/visualization","libs/bbi/bigwig"],function(e,a,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(e){return e&&e.__esModule?e:{default:e}}(a),n=function(e){if(e&&e.__esModule)return e;var a={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(a[t]=e[t]);return a.default=e,a}(t),i=r.default.GenomeDataManager.extend({load_data:function(e,a,t,r){var i=$.Deferred();this.set_data(e,i);var o=Galaxy.root+"datasets/"+this.get("dataset").id+"/display",s=this;new $.Deferred;return $.when(n.makeBwg(o)).then(function(a,t){$.when(a.readWigData(e.get("chrom"),e.get("start"),e.get("end"))).then(function(a){var t=[],r={max:Number.MIN_VALUE};a.forEach(function(e){r.max!==e.min-1&&(t.push([r.max+1,0]),t.push([e.min-2,0])),t.push([e.min-1,e.score]),t.push([e.max,e.score]),r=e});var n={data:t,region:e,dataset_type:"bigwig"};s.set_data(e,n),i.resolve(n)})}),i}});e.default={BBIDataManager:i}});
//# sourceMappingURL=../../maps/viz/bbi-data-manager.js.map
