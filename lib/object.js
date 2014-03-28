Object.defineProperty(Object.prototype, 'map', {
  value: function(f, ctx){
    ctx = ctx || this;
    var self = this, result = {};
    Object.keys(self).forEach(function(v){
      result[v] = f.call(ctx, self[v], v, self); 
    });
    return result;
  }
});

Object.defineProperty(Object.prototype, 'filter', {
  value: function(){
    var result = {};
    for (var i = 0; i < arguments.length; i++){
      if (Object.keys(this).indexOf(arguments[i]) != -1) result[arguments[i]] = this[arguments[i]]
    }
    return result;
  }
});
Object.defineProperty(Object.prototype, 'each', {
  value: function(f, ctx){
    ctx = ctx || this;
    var self = this;
    Object.keys(self).forEach(function(v){
      f.call(ctx, v, self[v], self);
    });
  }
});

