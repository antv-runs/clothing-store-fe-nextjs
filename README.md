# Clothing Store FE Next.js

## 1. Chạy ở chế độ Development (Máy local)

Để chạy dự án này bằng 1 lệnh duy nhất:

```bash
npm run dev
```

Sau đó, truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt.
Khi chỉnh sửa code ở chế độ này, code sẽ tự động cập nhật ngay trên trình duyệt (Hot Reload) mà không cần chạy lại lệnh.

## 2. Rebuild/Reload khi chạy bằng Docker

Nếu bạn đang chạy ứng dụng qua Docker và cập nhật code, hãy dùng lệnh sau để build lại và restart container:

```bash
docker compose up --build -d --force-recreate
```
