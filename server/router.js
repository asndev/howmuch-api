const passport = require('passport');

const AuthenticationCtrl = require('./controllers/authentication');
const ActivityListRouter = require('./config/activitylist.routes');
const ActivityRouter = require('./config/activity.routes');

// Setup passport strategies
require('./services/passport');

// Middleware
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const currentVersion = '/v1';

const router = (app) => {
  // dummy router, to be deleted
  app.get('/', requireAuth, (req, res) => {
    res.send({ success: true, user: req.user });
  });

  // signin middleware transforms email+password into user
  // user gets passed to signin controller
  // and returns token
  app.post('/signin', requireSignin, AuthenticationCtrl.signin);
  // signup passes email+password to controller
  // and returns token
  app.post('/signup', AuthenticationCtrl.signup);

  app.use(currentVersion + '/activitylist', requireAuth, ActivityListRouter);
  app.use(currentVersion + '/activitylist', requireAuth, ActivityRouter);

  // Handle 404
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: '404: Resource not found'
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      success: false,
      message: 'Something went terribly wrong',
      err: err
    });
  });
};

module.exports = router;
