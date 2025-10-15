import { Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderGateway, OrderStatus, OrderItem } from './order.gateway';

@Controller('orders')
export class OrderController {
  private logger: Logger = new Logger('OrderController');

  constructor(
    private orderService: OrderService,
    private orderGateway: OrderGateway,
  ) {}

  @Post()
  createOrder(
    @Body()
    createOrderDto: {
      customerName: string;
      items: Omit<OrderItem, 'id'>[];
    },
  ) {
    this.logger.log('Creating new order:', createOrderDto);

    const order = this.orderService.createOrder(
      createOrderDto.customerName,
      createOrderDto.items,
    );

    return {
      success: true,
      order,
      message: 'Order created successfully',
    };
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    const order = this.orderService.getOrder(id);
    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    return {
      success: true,
      order,
    };
  }

  @Get()
  getAllOrders() {
    const orders = this.orderService.getAllOrders();
    return {
      success: true,
      orders,
      count: orders.length,
    };
  }

  @Post(':id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { status: OrderStatus; message?: string },
  ) {
    this.logger.log(`Updating order ${id} status to ${updateStatusDto.status}`);

    const success = this.orderService.updateOrderStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.message,
    );

    if (!success) {
      return {
        success: false,
        message: 'Order not found or update failed',
      };
    }

    return {
      success: true,
      message: 'Order status updated successfully',
    };
  }

  @Get('stats/overview')
  getOrderStats() {
    const stats = this.orderService.getOrderStats();
    const connectedClients = this.orderGateway.getAllConnectedClients();

    return {
      success: true,
      stats,
      connectedClients: Object.fromEntries(connectedClients),
      totalConnectedClients: Array.from(connectedClients.values()).reduce(
        (sum, count) => sum + count,
        0,
      ),
    };
  }

  @Post('simulate/kitchen-workflow')
  simulateKitchenWorkflow() {
    this.logger.log('Simulating kitchen workflow...');
    this.orderService.simulateKitchenWorkflow();

    return {
      success: true,
      message: 'Kitchen workflow simulation started',
    };
  }

  // Demo endpoint to create sample orders
  @Post('demo/create-sample')
  createSampleOrders() {
    this.logger.log('Creating sample orders for PoC demonstration...');

    const sampleOrders = [
      {
        customerName: 'John Doe',
        items: [
          { name: 'Large Fries', price: 3.5, quantity: 1 },
          { name: 'Cheeseburger', price: 8.5, quantity: 1 },
          { name: 'Coca Cola', price: 2.0, quantity: 1 },
        ],
      },
      {
        customerName: 'Jane Smith',
        items: [
          { name: 'Small Fries', price: 2.5, quantity: 2 },
          { name: 'Chicken Burger', price: 9.5, quantity: 1 },
        ],
      },
      {
        customerName: 'Bob Johnson',
        items: [
          { name: 'Large Fries', price: 3.5, quantity: 1 },
          { name: 'Fish & Chips', price: 12.0, quantity: 1 },
          { name: 'Beer', price: 3.5, quantity: 1 },
        ],
      },
    ];

    const createdOrders = sampleOrders.map((orderData) =>
      this.orderService.createOrder(orderData.customerName, orderData.items),
    );

    return {
      success: true,
      orders: createdOrders,
      message: `Created ${createdOrders.length} sample orders`,
    };
  }
}
