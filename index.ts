import * as express from "express";
import "express-async-errors";
import {engine} from "express-handlebars";
import * as methodOverride from "method-override";
import {handleError} from "./utils/errors";
import {homeRouter} from "./routers/home";
import {static as eStatic, urlencoded} from "express";
import './utils/db';
import {warriorRouter} from "./routers/warrior";
import {arenaRouter} from "./routers/arena";
import {hallOfFameRouter} from "./routers/hall-of-fame";

const app = express();

app.use(methodOverride('_method'));
app.use(urlencoded({
    extended: true,
}));
app.use(eStatic('public'));
// app.use(express.json()); // Content-type: application/json
app.engine('.hbs', engine({
    extname: '.hbs',
    //helpers: handlebarsHelpers,
}));
app.set('view engine', '.hbs');

app.use('/', homeRouter);
app.use('/warrior', warriorRouter);
app.use('/arena', arenaRouter);
app.use('/hall-of-fame', hallOfFameRouter);

app.use(handleError);

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3000');
});
