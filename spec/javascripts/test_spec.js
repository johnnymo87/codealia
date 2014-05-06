// http://alistapart.com/article/getoutbindingsituations

describe('binding loss', function() {
  var jon, shawn;

  beforeEach(function() {
    Person = function(first) {
      this.first = first;
    }
    Person.prototype = {
      greet: function(other) {
          return "Hi " + other.first + ", I'm " + this.first + ".";
        }
    };
    jon = new Person('Jon');
    shawn = new Person('Shawn');
  });

  it('no problem', function() {
    expect(jon.greet(shawn)).toEqual("Hi Shawn, I'm Jon.")
  });

  it('binding problem', function() {
    var fx = jon.greet;
    expect(fx(shawn)).toEqual("Hi Shawn, I'm undefined.")
  });

  it('binding solution with apply()', function() {
    var fx = jon.greet;
    expect(fx.apply(jon, [shawn])).toEqual("Hi Shawn, I'm Jon.")
  });

  it('binding solution with __bind()', function() {
    var __bind = function(fn, me) {
      return function() {
        return fn.apply(me, arguments);
      };
    };
    var fx = __bind(jon.greet, jon);
    expect(fx(shawn)).toEqual("Hi Shawn, I'm Jon.")
  });
});

describe('Prototypes & Binding', function() {
  var __bind, test;

  beforeEach(function() {
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    var Test = (function() {
      function Test() {
        this.f0 = function() { return "See Spot run. " + this.f1() };
        this.f1 = function() { return "Run, Spot, run!"}
        //this.f1 = __bind(this.f1, this);
      }

      Test.prototype.f1 = function() { return " Oh, there he goes." };

      Test.prototype.f2 = function() { return new Test().f1() + Test.prototype.f1() };

      return Test;

    })();

    test = new Test();
  });

  it('class methods get called before prototype methods', function() {
    expect(test.f1()).toEqual('Run, Spot, run!');
  });

  it('__bind() prevents binding loss for class methods', function() {
    expect(test.f0()).toEqual('See Spot run. Run, Spot, run!');
    var fx = test.f0;
    expect(function() { fx() }).toThrow(new Error('this.f1 is not a function'));
    var fx = __bind(test.f0, test);
    expect(fx()).toEqual('See Spot run. Run, Spot, run!');
  });
  
  it('prototype methods are immune to binding loss', function() {
    expect(test.f2()).toEqual('Run, Spot, run! Oh, there he goes.')
    var fx = test.f2;
    expect(fx()).toEqual('Run, Spot, run! Oh, there he goes.')
  });
});
