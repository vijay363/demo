import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import SignaturePad from 'signature_pad';
import { SignatureService } from '../../../shared/services/signature.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-signature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fontCanvas') fontCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() id?: string;
  @Output() closed = new EventEmitter<boolean>();

  signaturePad!: SignaturePad;

  activeTab: 'draw' | 'font' | 'image' = 'draw';
  fontText = '';
  fontFamily = 'Pacifico';

  fonts = ['Pacifico', 'Great Vibes', 'Dancing Script', 'Allura', 'Satisfy'];
  imageDataUrl: string | null = null;
  imageError = '';
  toast = inject(ToastrService);
  commonService = inject(CommonService);

  constructor(private signatureService: SignatureService) { }

  ngAfterViewInit() {
    if (this.activeTab === 'draw') {
      setTimeout(() => {
        this.initPad();

        if (this.id) {
          this.loadSignature(this.id);
        }
      });
    }
  }

  switchTab(tab: 'draw' | 'font' | 'image') {
    this.activeTab = tab;

    this.imageDataUrl = null;
    this.imageError = '';

    if (tab === 'draw') {
      setTimeout(() => {
        this.initPad();

        if (this.id) {
          this.loadSignature(this.id);
        }
      });
    }
  }

  initPad() {
    if (!this.canvas) return;

    const canvas = this.canvas.nativeElement;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);

    this.signaturePad = new SignaturePad(canvas);
  }

  loadSignature(id: string) {
    this.signatureService.getById(id).subscribe((sig) => {
      if (!this.signaturePad) return;

      this.signaturePad.clear();
      this.signaturePad.fromDataURL(sig.signature);
    });
  }

  clear() {
    if (this.activeTab === 'draw') {
      this.signaturePad.clear();
    }

    if (this.activeTab === 'font') {
      this.fontText = '';
      this.renderFontPreview();
    }

    if (this.activeTab === 'image') {
      this.imageDataUrl = null;
      this.imageError = '';
    }
  }

  save() {
    if (this.activeTab === 'draw') {
      if (this.signaturePad.isEmpty()) {
        alert('Please provide a signature');
        return;
      }

      this.submit({
        type: 'draw',
        signature: this.signaturePad.toDataURL(),
      });
    }

    if (this.activeTab === 'font') {
      if (!this.fontText.trim()) {
        alert('Please enter a name');
        return;
      }

      this.renderFontPreview();
      this.submit({
        type: 'font',
        text: this.fontText,
        fontFamily: this.fontFamily,
        signature: this.fontCanvas.nativeElement.toDataURL(),
      });
    }

    if (this.activeTab === 'image') {
      if (!this.imageDataUrl) {
        alert('Please upload an image');
        return;
      }

      this.submit({
        type: 'image',
        signature: this.imageDataUrl,
      });
    }
  }

  submit(payload: any) {
    const isUpdate = !!this.id;

    const req$ = isUpdate
      ? this.signatureService.update(this.id!, payload)
      : this.signatureService.create(payload);

    req$.subscribe({
      next: () => {
        this.commonService.clearCache();

        this.toast.success(
          isUpdate
            ? 'Signature updated successfully'
            : 'Signature created successfully',
          'Success'
        );

        this.closed.emit(true);
      },
      error: () => {
        this.toast.error('Something went wrong', 'Error');
      },
    });
  }

  close() {
    this.closed.emit(false);
  }
  renderFontPreview() {
    if (!this.fontCanvas) return;

    const canvas = this.fontCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `48px ${this.fontFamily}`;

    ctx.fillText(this.fontText || '', canvas.width / 2, canvas.height / 2);
  }
  onImageSelect(event: Event) {
    this.imageError = '';
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      this.imageError = 'Only PNG or JPG images are allowed';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.imageError = 'Image must be smaller than 2MB';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageDataUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
