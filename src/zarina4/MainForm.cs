using System;
using System.Drawing;
using System.Windows.Forms;

namespace zarina4
{
    public partial class MainForm : Form
    {
        private int btnWidth = 100;
        private int btnHeight = 50;
        private int startX = 10;
        private int startY = 10;
        private int gapX = 10;
        private int gapY = 10;

        public MainForm()
        {
            InitializeComponent();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            // 4. Buton: Stok İşlemleri (2x2 grid sağ alt köşe)
            Button btnStok = new Button
            {
                Text = "Stok İşlemleri",
                BackColor = Color.IndianRed, // Farklı bir renk
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                Size = new Size(btnWidth, btnHeight),
                Location = new Point(startX + btnWidth + gapX, startY + btnHeight + gapY)
            };
            btnStok.Click += Stok_Click;
            this.Controls.Add(btnStok);

            // 5. Buton: Çalışan Takip (4'lü butonların altına ortalanmış)
            Button btnCalisanTakip = new Button
            {
                Text = "Çalışan Takip",
                BackColor = Color.MediumSeaGreen,
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                Size = new Size(btnWidth, btnHeight),
                Location = new Point(startX + (btnWidth + gapX) / 2, startY + 2 * (btnHeight + gapY))
            };
            btnCalisanTakip.Click += CalisanTakip_Click;
            this.Controls.Add(btnCalisanTakip);
        }

        private void Stok_Click(object sender, EventArgs e)
        {
            // Stok işlemleri butonuna tıklandığında yapılacak işlemler
        }

        private void CalisanTakip_Click(object sender, EventArgs e)
        {
            CalisanTakip calisanForm = new CalisanTakip();
            calisanForm.Show();
            this.Close();
        }
    }
} 