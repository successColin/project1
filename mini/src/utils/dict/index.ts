const dict = {
  orderList: [
    {
      value: 'NOT_PAID',
      label: 0,
      name: '未支付',
    },
    {
      value: 'PAY_FAILED',
      label: 1,
      lable: '支付失败',
    },
    // {
    //   value: 'PAID',
    //   label: 10,
    //   name: '已支付（待核销）',
    // },
    // {
    //   value: 'WAIT_COMMENT',
    //   label: 11,
    //   name: '待评价（完成核销）',
    // },
    {
      value: 'PAID',
      label: 10,
      name: '已支付',
    },
    {
      value: 'WAIT_COMMENT',
      label: 11,
      name: '待评价',
    },
    {
      value: 'COMMENTED',
      label: 12,
      name: '已评价',
    },
    {
      value: 'REFUNDED',
      label: 20,
      name: '已退款',
    },
    {
      value: 'REFUNDING',
      label: 21,
      name: '退款申请中',
    },
    {
      value: 'CANCELED',
      label: 30,
      name: '已取消',
    },
  ],
} as any;

export const getOptionItem = (name: string, value: string) => {
  const arr = dict[name] || [];
  if (!arr.length) return;
  const obj = arr.find((v: any) => v.value === value);
  if (JSON.stringify(obj) === '{}') return;
  return obj;
};
