import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ThemeService } from '../../../core/cache/services/theme.service';

@Component({
  selector: 'app-base-chart',
  imports: [CommonModule],
  templateUrl: './base-chart.component.html',
  styleUrl: './base-chart.component.scss',
})
export class BaseChartComponent implements AfterViewInit, OnDestroy {
  @Input() configFn!: () => Promise<any>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() title = '';

  chart!: Chart;
  loading = false;
constructor(private theme: ThemeService) {}
  async ngAfterViewInit() {
    await this.loadChart();
  }

  async loadChart() {
    if (this.loading) return;

    this.loading = true;
    try {
      const config = await this.configFn();
      this.chart?.destroy();
      this.chart = new Chart(this.canvas.nativeElement, config);
    } finally {
      this.loading = false;
    }
  }

  reload() {
    this.loadChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}

