#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// Calcul du PGCD
long long pgcd(long long a, long long b) {
    while (b != 0) {
        long long temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Euclide étendu pour trouver l'inverse modulaire (d)
long long modInverse(long long e, long long phi) {
    long long m0 = phi, t, q;
    long long x0 = 0, x1 = 1;

    if (phi == 1) return 0;

    while (e > 1) {
        q = e / phi;
        t = phi;
        phi = e % phi;
        e = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0) x1 += m0;
    return x1;
}

// Exponentiation modulaire rapide : (base^exp) % mod
long long modExpo(long long base, long long exp, long long mod) {
    long long result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 == 1) result = (result * base) % mod;
        exp = exp >> 1;
        base = (base * base) % mod;
    }
    return result;
}

int main() {
    // Choix de deux nombres premiers p et q
    long long p = 61, q = 53;
    long long n = p * q;
    long long phi = (p - 1) * (q - 1);

    // Choix de l'exposant public e
    long long e = 17;
    while (e < phi) {
        if (pgcd(e, phi) == 1) break;
        e++;
    }

    // Calcul de l'exposant privé d
    long long d = modInverse(e, phi);

    printf("--- CLEFS RSA ---\n");
    printf("Clé publique (e, n) : (%lld, %lld)\n", e, n);
    printf("Clé privée   (d, n) : (%lld, %lld)\n\n", d, n);

    // Message à chiffrer (représentation numérique)
    long long message = 65; // Exemple : Caractère 'A'
    long long chiffre = modExpo(message, e, n);
    long long dechiffre = modExpo(chiffre, d, n);

    printf("Message original  : %lld\n", message);
    printf("Message chiffré   : %lld\n", chiffre);
    printf("Message déchiffré : %lld\n", dechiffre);

    return 0;
}