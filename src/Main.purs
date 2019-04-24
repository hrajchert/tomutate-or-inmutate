module Main where

import Prelude

import Effect (Effect)
import Effect.Console (log)
import QSort (cmpNumberAsc, mutableQSortBy, mutableQSortBy2, qsortBy2)

main :: Effect Unit
main = do
  log $ show $ mutableQSortBy cmpNumberAsc [1, 2, 3]
  log $ show $ mutableQSortBy2 cmpNumberAsc [1, 2, 3]
  log $ show $ qsortBy2 cmpNumberAsc [1, 2, 3]
