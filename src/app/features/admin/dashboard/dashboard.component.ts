import { Component, signal } from '@angular/core';
import { MetabaseEmbedService } from '../../../core/services/metabase-embed.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  iframeUrl = signal<SafeResourceUrl | undefined>(undefined);

  constructor(private sanitizer: DomSanitizer, private metabaseEmbedService: MetabaseEmbedService) {
    this.loadIframeUrl();
  }

  private async loadIframeUrl() {
    try {
      const url = await this.metabaseEmbedService.generateMetabaseEmbedUrl();
      this.iframeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    } catch (error) {
      console.error('Error generating Metabase embed URL:', error);
    }
  }


  openMetabaseDashboard() {
    if (this.iframeUrl()) {
      window.open("http://localhost:3100/dashboard/98", "_blank");
    } else {
      console.error('Iframe URL is not available yet.');
    }
  }
}