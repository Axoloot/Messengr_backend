#Norme de Commit 

##Le Commit Parfait

```javascript
<Type_du_commit>(<Label>): <Sujet>

<Description>

<Footer>
```

##Type du commit

Le type nous informe du type de commit. 9 types sont disponibles :

*`build` changements qui affectent le système de build ou des dépendances externes (npm, make…)

*`ci` changements concernant les fichiers et scripts d’intégration ou de configuration (Travis, Ansible, BrowserStack…)
  
*`feat` ajout d’une nouvelle fonctionnalité
  
*`fix` correction d’un bug
  
*`perf` amélioration des performances
  
*`refactor` modification qui n’apporte ni nouvelle fonctionnalité ni d’amélioration de performances
  
*`style` changement qui n’apporte aucune alteration fonctionnelle ou sémantique (indentation, mise en forme, ajout d’espace, renommant d’une variable…)
 
*`docs` rédaction ou mise à jour de documentation

*`test` ajout ou modification de tests


##Le Label
C’est le deuxième élément de la première ligne. 
Il nous permet immédiatement de savoir quelle partie du projet est affectée. Par exemple pour un site de e-commerce , on pourrait avoir product, cart ou checkout.

Cet élément est facultatif. En effet, il n’est parfois pas pertinent.

##Le Sujet
Le sujet contient une description succincte des changements. 


En général, on se limite à 50 caractères. De nombreux outils avertissent d’ailleurs lorsque l’on dépasse la longueur maximale.

##La Description

Beaucoup l’ignorent, mais les messages peuvent comporter un corps dans lequel on peut expliquer plus en détails la raison des changements. De même que pour le sujet, on utilisera l’impératif présent.

De nouveau, on explique ici la raison du changement et en quoi c’est nouvelle manière est différente de l’état précédent.

Le comment est visible directement dans le code. Par ailleurs, si le code est complexe, c’est le moment de penser à le commenter si ce n’est pas déjà fait !


##Le footer

De même que le corps du message, le footer est facultatif. On l’utilisera d’ailleurs moins souvent.

On réserve le footer aux breaking changes et on y référence aussi le ticket d’erreur que règlent les modifications le cas échéant.
