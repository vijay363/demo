import { Component } from '@angular/core';
import { ChartService } from '../../../shared/services/chart.service';
import { BaseChartComponent } from "../base-chart/base-chart.component";
import { firstValueFrom } from 'rxjs';
import { chartTheme } from '../../../shared/utils/chart-theme.util';

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private charts: ChartService) {}
   chartTheme() {
  const styles = getComputedStyle(document.documentElement);

  return {
    text: styles.getPropertyValue('--text-secondary'),
    grid: styles.getPropertyValue('--border-color'),
    primary: styles.getPropertyValue('--primary'),
  };
}


salesChart = async () => {
  const res = await firstValueFrom(this.charts.getSales());
  const theme = this.chartTheme();

  return {
    type: 'bar',
    data: {
      labels: res.labels,
      datasets: [
        {
          label: 'Sales',
          data: res.data,
          backgroundColor: theme.primary,
          borderRadius: 6,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: { color: theme.text },
        },
      },
      scales: {
        x: {
          ticks: { color: theme.text },
          grid: { color: theme.grid },
        },
        y: {
          ticks: { color: theme.text },
          grid: { color: theme.grid },
        },
      },
    },
  };
};



  usersChart = async () => {
    const res = await firstValueFrom(this.charts.getUsers());
    return {
      type: 'line',
      data: {
        labels: res.labels,
        datasets: [{ label: 'Users', data: res.data }],
      },
    };
  };

trafficChart = async () => {
  const res = await firstValueFrom(this.charts.getTraffic());
  const theme = this.chartTheme();

  return {
    type: 'pie',
    data: {
      labels: res.labels,
      datasets: [
        {
          data: res.data,
          backgroundColor: [
            theme.primary,
            '#22c55e',
            '#f59e0b',
          ],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: { color: theme.text },
        },
      },
    },
  };
};



  revenueChart = async () => {
    const res = await firstValueFrom(this.charts.getRevenue());
    return {
      type: 'radar',
      data: {
        labels: res.labels,
        datasets: [{ label: 'Revenue', data: res.data }],
      },
    };
  };
  
}

