namespace zarina4
{
    public partial class CalisanTakip : Form
    {
        private List<Calisan> calisanlar = new List<Calisan>();
        private string dosyaYolu = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
            "GelinlikTakip",
            "calisanlar.txt"
        );

        public CalisanTakip()
        {
            this.Text = "Çalışan Takip";
        }
    }
} 