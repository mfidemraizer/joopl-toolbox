"use strict";(function(){$namespace.register("joopl",function(){this.Convert=$def({$members:{toObject:function(n,t){switch(typeof n){case"number":return new Number(n);case"string":return new String(n);case"boolean":return new Boolean(n);default:if(t)throw new this.ArgumentException({argName:"value",reason:"Primitive type not supported"});else return n}}}});this.Convert=new this.Convert})})()
