const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {

  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const todosCount = await redis.getAsync("todos")
  await redis.setAsync("todos", Number(todosCount) + 1)
  console.log(todosCount)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  return res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const done = req.body.done
  if (!done && done !== true && done !== false) {
	  console.log(done)
	return res.sendStatus(405); // Implement this
  }
  if (done === true) {
	  req.todo.done = true
  } else if (done === false) {
	  req.todo.done = false
  }
  await req.todo.save()
  return res.send(req.todo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
