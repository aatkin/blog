const Types = {
  // api
  UserController: Symbol("UserController"),
  PageController: Symbol("PageController"),

  // routes
  ApiRoute: Symbol("ApiRoute"),
  UserRoute: Symbol("UserRoute"),
  PageRoute: Symbol("PageRoute"),

  // utils
  Logger: Symbol("Logger"),

  // main
  DatabaseService: Symbol("DatabaseService"),
  AuthenticationController: Symbol("AuthenticationController"),
  ConfigService: Symbol("ConfigService")
};

export { Types };
