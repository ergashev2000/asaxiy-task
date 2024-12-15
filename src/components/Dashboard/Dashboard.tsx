import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { Transaction } from '../../types/index.ts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: {[key: string]: number}, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {});

  const getLastMonths = () => {
    const months: string[] = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));
    }
    return months;
  };

  const monthLabels = getLastMonths();

  const initialMonthlyData = monthLabels.reduce((acc: {[key: string]: {income: number, expense: number}}, month) => {
    acc[month] = { income: 0, expense: 0 };
    return acc;
  }, {});

  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    if (initialMonthlyData[month]) {
      if (t.type === 'income') {
        initialMonthlyData[month].income += t.amount;
      } else {
        initialMonthlyData[month].expense += t.amount;
      }
    }
  });

  const pieChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Income',
        data: monthLabels.map(month => initialMonthlyData[month].income),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: monthLabels.map(month => initialMonthlyData[month].expense),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4
      }
    ]
  };

  return (
    <div>
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="h-100 stat-card">
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="text-muted mb-3">Total Income</Card.Title>
              <h3 className="text-success mb-0">${totalIncome.toFixed(2)}</h3>
              <div className="mt-3">
                <i className="fas fa-arrow-up text-success me-2"></i>
                <small className="text-success">
                  +{totalIncome + totalExpense > 0 
                    ? ((totalIncome / (totalIncome + totalExpense)) * 100).toFixed(1) 
                    : '0'}%
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 stat-card">
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="text-muted mb-3">Total Expenses</Card.Title>
              <h3 className="text-danger mb-0">${totalExpense.toFixed(2)}</h3>
              <div className="mt-3">
                <i className="fas fa-arrow-down text-danger me-2"></i>
                <small className="text-danger">
                  -{totalIncome + totalExpense > 0 
                    ? ((totalExpense / (totalIncome + totalExpense)) * 100).toFixed(1)
                    : '0'}%
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 stat-card">
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="text-muted mb-3">Net Balance</Card.Title>
              <h3 className={netBalance >= 0 ? 'text-success mb-0' : 'text-danger mb-0'}>
                ${netBalance.toFixed(2)}
              </h3>
              <div className="mt-3">
                <small className={netBalance >= 0 ? 'text-success' : 'text-danger'}>
                  {netBalance >= 0 ? 'Positive Balance' : 'Negative Balance'}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Expense Categories</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container position-relative">
                {Object.keys(expensesByCategory).length > 0 ? (
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        }
                      },
                      animation: {
                        animateScale: true,
                        animateRotate: true
                      }
                    }}
                  />
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No expense data available</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Monthly Trends</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container position-relative">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    animation: {
                      duration: 2000,
                      easing: 'easeInOutQuart'
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
