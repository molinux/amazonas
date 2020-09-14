import express from 'express';
import { orderDeleteReducer } from '../../frontend/src/reducers/orderReducers';
import Order from '../models/orderModel';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

router.get('/', isAuth, async (req, res) => {
  const orders = await Order.find({}).populate('user');
  return res.send(orders);
});

router.get('/mine', isAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  return res.send(orders);
});

router.get('/:id', isAuth, async(req, res) => {
  const order = await Order.findOne({ _id: req.params.id});
  if(order) {
    res.send(order);
  } else {
    res.status(404).send('Order not found.');
  }
})

router.delete('/:id', isAuth, isAadmin, async(req, res) => {
  const order = await Order.findOne({ _id: req.params.id});
  if(order) {
    const deleteOrder = await order.remove();
    res.send(deleteOrder);
  } else {
    res.status(404).send('Order not found.');
  }
})

router.post('/', isAuth, async(req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  });
  
  router.put(':id/pay', isAuth, async(req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.payment = {
        paymentMethod: 'paypal',
        paymentResult: {
          payerID: req.body.payerID,
          orderID: req.body.orderID,
          paymentID: req.body.paymentID
        }
      }
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid.', order: updateOrder });
    } else {
      res.status(404).send({ message: 'Order not found.'});
    }
  });

  const newOrderCreated = await newOrder.save();
  res.status(201).send({message: 'New Order Created', data: newOrderCreated });
});

export default router;