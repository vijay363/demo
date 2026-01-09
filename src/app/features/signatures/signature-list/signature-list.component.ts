import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SignatureService } from '../../../shared/services/signature.service';
import { CommonService } from '../../../shared/services/common.service';
import { SignatureComponent } from '../signature/signature.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signature-list',
  imports: [CommonModule, SignatureComponent],
  templateUrl: './signature-list.component.html',
  styleUrl: './signature-list.component.scss',
})
export class SignatureListComponent implements OnInit {
  signatures: any[] = [];
  showModal = false;
  selectedId?: string;
  toast = inject(ToastrService);
  commonService = inject(CommonService);

  constructor(private signatureService: SignatureService) {}

  ngOnInit() {
    this.loadSignatures();
  }

  loadSignatures() {
    this.signatureService.getAll().subscribe((data) => {
      this.signatures = data;
    });
  }

  openAdd() {
    this.selectedId = undefined;
    this.showModal = true;
  }

  openEdit(id: string) {
    this.selectedId = id;
    this.showModal = true;
  }

  onModalClose(saved: boolean) {
    this.showModal = false;
    this.selectedId = undefined;
    if (saved) this.loadSignatures();
  }

  delete(id: string) {
    if (!confirm('Delete this signature?')) return;

    this.signatureService.delete(id).subscribe({
      next: () => {
        this.commonService.clearCache();

        this.toast.success('Signature deleted successfully', 'Success');
        this.loadSignatures();
      },
      error: () => {
        this.toast.error('Failed to delete signature', 'Error');
      },
    });
  }
}
