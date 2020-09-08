class RoutesObj { 
    constructor(template) {
      this.template = template;
      this.routes = [
        {
          path: '/',
          getTemplate:  (params) => this.template.load('Login'),
        },
        {
          path: '/home',
          getTemplate:  (params) => this.template.load('Home'),
        },
        {
          path: '/navbar',
          getTemplate:  (params) => this.template.load('Navbar'),
        }
      ];
    }
  }