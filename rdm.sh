## bring up one of the andr2 back up directories online or save current as bkup 

if [[ $# -eq 0 ]]; then
  echo "React-native app directory manager usage:	rdm.sh bkup-id"
  echo "if bkup-id does not exist, e.g., not in [1~9], or non-number,  save current as bkup with an avalable bkup id"
  exit 1
fi

function findAvaBkupId {
  local existingBkupId
  local nextAvaId=0 	## meaning no more backup slot available
  ## existingBkupId=$(for d in $(ls -d */ | grep andr2); do echo ${${d##andr2-}%%/} ; done | grep -v andr2)
  for i in 1 2 3 4 5 6 7 8 9; do 
	if [[ ! -d andr2-$i ]]; then
	  nextAvaId=$i
	  break;		
	fi	
  done
  echo $nextAvaId
}

function bkupCurr {
  if [[ -d andr2 ]]; then  
  	echo moving current andr2 to andr2-$avaBkupId
  	mv andr2 andr2-$avaBkupId
  fi
}

reqBkupId=$1
avaBkupId=$(findAvaBkupId)

if [[ $avaBkupId -eq 0 ]]; then 
  echo "no more backup slot available."
  exit 1
fi

if [[ ! -d andr2-$reqBkupId ]]; then 
  echo "Backup #$reqBkupId not found!"
  bkupCurr
  exit 0
fi

## bkup # $reqBkupId exists
bkupCurr
echo moving backup andr2-$reqBkupId as andr2
mv andr2-$reqBkupId andr2
