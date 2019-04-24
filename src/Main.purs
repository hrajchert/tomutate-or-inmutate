module Main where

import Prelude

import Effect (Effect)
import Effect.Console (log)
import QSort (cmpNumberAsc, mutableQSortBy, qsortBy)

main :: Effect Unit
main = do
  log $ show $ mutableQSortBy cmpNumberAsc [1, 2, 3]
  log $ show $ qsortBy cmpNumberAsc [1, 2, 3]
