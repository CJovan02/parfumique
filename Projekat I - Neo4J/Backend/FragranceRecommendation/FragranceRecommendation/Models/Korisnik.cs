﻿namespace FragranceRecommendation.Models;

public class Korisnik
{
    //nije dodato u bazu
    public string Slika { get; set; } = String.Empty;
    public string Ime { get; set; }
    public string Prezime { get; set; }
    public char Pol { get; set; } = 'M';
    public string KorisnickoIme { get; set; }
    public string Sifra { get; set; }
    public IList<Parfem> KolekcijaParfema { get; set; } = new List<Parfem>();

    #region Constructors
    public Korisnik() { }

    public Korisnik(string ime, string prezime, char pol, string korisnickoIme, string sifra)
    {
        Ime = ime;
        Prezime = prezime;
        Pol = pol;
        KorisnickoIme = korisnickoIme;
        Sifra = sifra;
    }
    #endregion
}
