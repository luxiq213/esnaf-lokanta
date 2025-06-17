using System;
using System.Drawing;
using System.Windows.Forms;

namespace zarina4
{
    public partial class Randevu : Form
    {
        public Randevu()
        {
            InitializeComponent();

            // Sağ üstte büyükçe ve modern Geri butonu
            Button btnGeri = new Button
            {
                Text = "← Geri",
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                Size = new Size(80, 35),
                BackColor = Color.LightGray,
                ForeColor = Color.Black,
                FlatStyle = FlatStyle.Flat,
                Cursor = Cursors.Hand,
                Top = 10,
                Left = this.ClientSize.Width - 90,
                Anchor = AnchorStyles.Top | AnchorStyles.Right
            };
            btnGeri.FlatAppearance.BorderSize = 0;
            btnGeri.Click += (s, e) =>
            {
                MainForm main = new MainForm();
                main.Show();
                this.Close();
            };
            this.Controls.Add(btnGeri);
            btnGeri.BringToFront();
        }
    }
} 